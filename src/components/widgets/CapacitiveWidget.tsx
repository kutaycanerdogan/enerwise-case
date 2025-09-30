import seed from "../../data/seed.json";
import { WidgetProps, useLayoutStore } from "../../store/layoutStore";
import WidgetHeader from "./WidgetHeader";
import { PieChart, Pie, Cell, Text, ResponsiveContainer } from "recharts";

const SEGMENTS = 10; // %10’luk dilimler
const SUBDIVISIONS = 5; // her %10 dilim içinde 5 küçük çizgi (%2 aralık)

const COLORS = [
	"#22c55e", // 0–10
	"#4ade80", // 10–20
	"#eab308", // 20–30
	"#facc15", // 30–40
	"#f97316", // 40–50
	"#fb923c", // 50–60
	"#ef4444", // 60–70
	"#f87171", // 70–80
	"#dc2626", // 80–90
	"#991b1b", // 90–100
];

export default function CapacitiveWidget({ id, title, showComponents }: WidgetProps) {
	const minimized = useLayoutStore((s) => s.minimized[id] ?? false);

	const pct = seed.capacitiveLoadPct;
	const clamped = Math.max(0, Math.min(100, pct));
	const width = 360;
	const cx = width / 2;
	const cy = width / 2;
	const radius = 120;
	const RAD = Math.PI / 180;
	// Segment data (%10’luk dilimler)
	const data = Array.from({ length: SEGMENTS }, (_, i) => ({
		name: `${i * 10}-${(i + 1) * 10}%`,
		value: 10,
		filled: clamped >= (i + 1) * 10,
	}));

	// İbre açısı
	const angle = 180 - (clamped / 100) * 180;
	const x = cx + radius * Math.cos(RAD * angle);
	const y = cy - radius * Math.sin(RAD * angle);

	// Dış label pozisyonları (%0–%100)
	const labelAngles = Array.from({ length: SEGMENTS + 1 }, (_, i) => 180 - i * (180 / SEGMENTS));
	const labelPositions = labelAngles.map((a, i) => {
		const lx = cx + (radius + 25) * Math.cos(RAD * a);
		const ly = cy - (radius + 25) * Math.sin(RAD * a);
		return { x: lx, y: ly, label: `${i * 10}%`, color: COLORS[Math.min(i, COLORS.length - 1)] };
	});

	// Küçük tick çizgileri (her %2)
	const ticks = Array.from({ length: SEGMENTS * SUBDIVISIONS + 1 }, (_, i) => {
		const a = 180 - i * (180 / (SEGMENTS * SUBDIVISIONS));
		const x1 = cx + (radius + 5) * Math.cos(RAD * a);
		const y1 = cy - (radius + 5) * Math.sin(RAD * a);
		const x2 = cx + (radius + 15) * Math.cos(RAD * a);
		const y2 = cy - (radius + 15) * Math.sin(RAD * a);
		return { x1, y1, x2, y2, major: i % SUBDIVISIONS === 0 };
	});

	return (
		<article>
			<WidgetHeader id={id} title={title} showComponents={showComponents} />
			{!minimized && (
				<div className="w-full flex flex-col items-center">
					<PieChart width={width} height={width / 2 + 60}>
						{/* Gauge segmentleri */}
						<Pie data={data} startAngle={180} endAngle={0} dataKey="value" cx={cx} cy={cy} innerRadius="70%" outerRadius="100%" stroke="none">
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.filled ? COLORS[index] : "#e5e7eb"} />
							))}
						</Pie>

						{/* Tick çizgileri */}
						<g>
							{ticks.map((t, i) => (
								<line key={`tick-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#333" strokeWidth={t.major ? 2 : 1} />
							))}
						</g>

						{/* Ok işareti */}
						<g>
							<circle cx={cx} cy={cy} r={8} fill="#333" />
							<path d={`M${cx},${cy} L${x},${y}`} stroke="#333" strokeWidth={6} strokeLinecap="round" />
						</g>

						{/* Dış yüzde etiketleri */}
						{labelPositions.map((pos, i) => (
							<Text key={`label-${i}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={12} fill={pos.color} fontWeight="bold">
								{pos.label}
							</Text>
						))}
					</PieChart>

					{/* Merkezdeki değer */}
					<div className="text-center -mt-4">
						<div className="text-2xl font-bold">{clamped}%</div>
						<div className="text-sm text-muted-foreground">Kapasitif</div>
					</div>
				</div>
			)}
		</article>
	);
}
