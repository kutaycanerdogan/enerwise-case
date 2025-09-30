import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo, useState } from "react";
import seed from "../../data/seed.json";
import { WidgetProps, useLayoutStore } from "../../store/layoutStore";
import { Cross1Icon } from "@radix-ui/react-icons";
import Icon from "../icons/Icon";
import WidgetHeader from "./WidgetHeader";
import { DateRangePicker } from "../ui/DateRangePicker";
import { DateRange } from "react-day-picker";

type Point = [string, number];

function movingAverage(points: Point[], window = 3): Point[] {
	const vals = points.map((p) => p[1]);
	const dates = points.map((p) => p[0]);
	const out: Point[] = [];
	for (let i = 0; i < vals.length; i++) {
		const start = Math.max(0, i - window + 1);
		const slice = vals.slice(start, i + 1);
		const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
		out.push([dates[i], Number(avg.toFixed(2))]);
	}
	return out;
}

function downsample(points: Point[], step = 2): Point[] {
	return points.filter((_, i) => i % step === 0);
}

function buildMerged(series: { name: string; points: Point[] }[]): Record<string, number | string>[] {
	const byDate = new Map<string, Record<string, number | string>>();
	for (const s of series) {
		for (const [date, val] of s.points) {
			const row = byDate.get(date) || { date };
			row[s.name] = val;
			byDate.set(date, row);
		}
	}
	return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function lineColor(i: number) {
	const palette = ["#3b82f6", "#ef4444", "#22c55e", "#eab308", "#a855f7", "#06b6d4"];
	return palette[i % palette.length];
}

export default function ChartWidget({ id, title, showComponents }: WidgetProps) {
	const [rangeId, setRangeId] = useState(seed.timeRanges[0].id);
	const [transform, setTransform] = useState<"none" | "downsample" | "mavg">("none");
	const [visible, setVisible] = useState<Record<string, boolean>>(Object.fromEntries(seed.series.map((s) => [s.name, true])));
	const rangeDays = seed.timeRanges.find((r) => r.id === rangeId)?.days ?? 7;
	const [range, setRange] = useState<DateRange>({
		from: new Date("2025-08-26"),
		to: new Date("2025-09-26"),
	});
	const minimized = useLayoutStore((s) => s.minimized[id] ?? false);

	const data = useMemo(() => {
		const build = (points: Point[]): Point[] => {
			const arr: Point[] = [];
			const totalDays = Math.floor((range.to!.getTime() - range.from!.getTime()) / (1000 * 60 * 60 * 24)) + 1;

			for (let i = 0; i < totalDays; i++) {
				const p = points[i % points.length];
				const d = new Date(range.from!);
				d.setDate(d.getDate() + i);
				arr.push([d.toISOString().slice(0, 10), p[1]]);
			}

			switch (transform) {
				case "downsample":
					return downsample(arr, 2);
				case "mavg":
					return movingAverage(arr, 3);
				default:
					return arr;
			}
		};

		const merged = buildMerged(
			seed.series.map((s) => ({
				name: s.name,
				points: build(s.points as Point[]),
			}))
		);

		return merged;
	}, [rangeDays, transform, range]);

	const seriesNames = seed.series.map((s) => s.name);

	return (
		<article>
			<WidgetHeader id={id} title={title} showComponents={showComponents}>
				<div className="flex items-center gap-2">
					<DateRangePicker range={range} setRange={setRange} />

					<select value={rangeId} onChange={(e) => setRangeId(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-sm" aria-label="Tarih aralığı">
						{seed.timeRanges.map((r) => (
							<option key={r.id} value={r.id}>
								{r.label}
							</option>
						))}
					</select>

					<select value={transform} onChange={(e) => setTransform(e.target.value as any)} className="rounded-md border border-input bg-background px-2 py-1 text-sm" aria-label="Veri dönüşümü">
						<option value="none">Ham veri</option>
						<option value="downsample">Downsample</option>
						<option value="mavg">Moving Avg</option>
					</select>
				</div>
			</WidgetHeader>
			{!minimized && (
				<div className="px-3 py-3 h-[calc(100%-40px)]">
					<div className="mb-2 flex flex-wrap items-center gap-2">
						{seriesNames.map((name) => (
							<label key={name} className="inline-flex items-center gap-1 text-xs">
								<input type="checkbox" checked={visible[name]} onChange={(e) => setVisible((prev) => ({ ...prev, [name]: e.target.checked }))} aria-label={`${name} serisini göster/gizle`} />
								<span>{name}</span>
							</label>
						))}
					</div>

					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d: string) => d.slice(5)} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip formatter={(value: any, name: string) => [value, name]} labelFormatter={(l: any) => `Tarih: ${l}`} />
								<Legend />
								{seriesNames.map((name, idx) => (visible[name] ? <Line key={name} type="monotone" dataKey={name} stroke={lineColor(idx)} dot={false} strokeWidth={2} isAnimationActive={false} /> : null))}
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</article>
	);
}
