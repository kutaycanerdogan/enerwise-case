import seed from "../../data/seed.json";
import { useLayoutStore, WidgetProps } from "../../store/layoutStore";
import WidgetHeader from "./WidgetHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

export default function DepartmentsWidget({ id, title, showComponents }: WidgetProps) {
	const minimized = useLayoutStore((s) => s.minimized[id] ?? false);
	return (
		<article>
			<WidgetHeader id={id} title={title} showComponents={showComponents} />
			{!minimized && (
				<div className="w-full h-[300px]">
					<ResponsiveContainer>
						<BarChart layout="vertical" data={seed.departments} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
							{/* <CartesianGrid strokeDasharray="3 3" /> */}
							<XAxis type="number" />
							<YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
							<Tooltip formatter={(value: number) => `${value.toLocaleString("tr-TR")} kWh`} />
							<Bar dataKey="value" fill="#3b82f6" barSize={24}>
								<LabelList dataKey="value" position="right" formatter={(value) => value?.toLocaleString()} />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</article>
	);
}
