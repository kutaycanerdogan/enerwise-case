import { useEffect, useMemo, useState } from "react";
import { allWidgets, useLayoutStore, type WidgetId } from "../../store/layoutStore";
import * as Tooltip from "@radix-ui/react-tooltip";
import { PlusCircledIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Icon from "../icons/Icon";

type Props = { filterQuery: string };

export default function WidgetPicker({ filterQuery }: Props) {
	const widgetsToAdd = useLayoutStore((s) => s.widgetsToAdd);
	const setWidgetsToAdd = useLayoutStore((s) => s.setWidgetsToAdd);
	const addWidgetToLayout = useLayoutStore((s) => s.addWidgetToLayout);
	const selectedWidgets = useLayoutStore((s) => s.selectedWidgets);
	const setSelectedWidgets = useLayoutStore((s) => s.setSelectedWidgets);

	const [availableWidgets, setavailableWidgets] = useState(allWidgets);

	useEffect(() => {
		setavailableWidgets(selectedWidgets.length === 0 ? allWidgets : allWidgets.filter((a) => !selectedWidgets.includes(a.id)));
	}, [selectedWidgets]);

	const filtered = useMemo(() => {
		const q = filterQuery.trim().toLowerCase();
		return q ? availableWidgets.filter((w) => w.label.toLowerCase().includes(q)) : availableWidgets;
	}, [filterQuery, availableWidgets]);

	const handleSelect = (e: React.MouseEvent, id: WidgetId) => {
		if (e.ctrlKey || e.metaKey) {
			addWidgetToLayout(widgetsToAdd.includes(id) ? widgetsToAdd.filter((x) => x !== id) : [...widgetsToAdd, id]);
		}
	};

	return (
		<div aria-label="Bileşen Seçim Çubuğu" className="flex items-start flex-col gap-2">
			<Tooltip.Provider>
				<div className="flex flex-wrap gap-2 border-solid border-b pb-2 w-full">
					{filtered.map((w) => (
						<Tooltip.Root key={w.id}>
							<Tooltip.Trigger asChild>
								<div key={w.id} id={w.id} className={clsx("droppable-element card flex w-[200px] justify-between items-center p-1 px-2", widgetsToAdd.includes(w.id) && "ring-2 ring-primary")} onClick={(e) => handleSelect(e, w.id)} draggable unselectable="on" onDragStart={(e) => e.dataTransfer.setData("text/plain", w.id)}>
									<div
										className="w-1/6"
										onClick={() => {
											addWidgetToLayout(w.id);
										}}>
										<Icon IconComponent={PlusCircledIcon} transparent={true} />
									</div>
									<div className="truncate">{w.label}</div>
									<div className="w-1/6">
										<Icon IconComponent={EyeOpenIcon} transparent={true} />
									</div>
								</div>
							</Tooltip.Trigger>
							<Tooltip.Content className="rounded-md border border-border bg-background px-2 py-1 text-xs">
								{w.preview}
								<Tooltip.Arrow />
							</Tooltip.Content>
						</Tooltip.Root>
					))}
				</div>
			</Tooltip.Provider>

			<div className="ml-2 flex justify-end items-center gap-2 w-full">
				<button
					className="rounded-md border border-border px-2 py-1 text-sm bg-secondary"
					onClick={() => {
						setWidgetsToAdd([]);
					}}
					aria-label="Sıfırla">
					Sıfırla
				</button>

				<button
					className="rounded-md border border-border px-2 py-1 text-sm bg-chart-2 text-white"
					onClick={() => {
						addWidgetToLayout(widgetsToAdd);
						setWidgetsToAdd([]);
					}}
					aria-label="Kaydet">
					Kaydet
				</button>

				<button
					className="rounded-md border border-border px-2 py-1 text-sm bg-chart-1 text-white"
					onClick={() => {
						setSelectedWidgets([]);
						setWidgetsToAdd([]);
					}}
					aria-label="Tüm Bileşenleri Kaldır">
					Tüm Bileşenleri Kaldır
				</button>
			</div>
		</div>
	);
}
