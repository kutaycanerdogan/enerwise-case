import { useEffect, useState } from "react";
import { WidgetProps, useLayoutStore } from "../../store/layoutStore";
import seed from "../../data/seed.json";
import Icon from "../icons/Icon";
import WidgetHeader from "./WidgetHeader";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export default function KpiCardWidget({ id, title, kpiId, icon, showComponents }: WidgetProps) {
	const kpi = seed.kpis.find((k) => k.id === kpiId);

	const [value, setValue] = useState(kpi?.value ?? 0);
	const [delta, setDelta] = useState(kpi?.delta ?? 0);
	const [unit, setUnit] = useState(kpi?.unit ?? "");

	const minimized = useLayoutStore((s) => s.minimized[id] ?? false);

	useEffect(() => {
		setValue(kpi?.value ?? 0);
		setDelta(kpi?.delta ?? 0);
		setUnit(kpi?.unit ?? "");
	}, [kpiId]);

	return (
		<article>
			<WidgetHeader id={id} title={title} showComponents={showComponents} />

			{!minimized && (
				<div className="flex justify-between px-2 py-2">
					<div className="text-l font-semibold text-chart-2">
						<strong>{value.toLocaleString("tr-TR")}</strong>
						<span className="ml-2 text-sm ">{unit}</span>
					</div>
					<div className="mt-1 text-sm">
						<span className={`flex gap-1 ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
							{delta >= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />} {Math.abs(delta).toFixed(2)}%
						</span>
					</div>
					<Icon IconComponent={icon as React.ComponentType<any>} w="30px" h="30px" />
				</div>
			)}
		</article>
	);
}
