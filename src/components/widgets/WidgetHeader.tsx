import React, { Component } from "react";
import Icon from "../icons/Icon";
import { Cross1Icon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useLayoutStore, WidgetId } from "@/store/layoutStore";
import { Maximize2, Minus } from "lucide-react";

type Props = {
	id: WidgetId;
	title: string;
	children?: React.ReactNode;
	showComponents: boolean;
};

export default function WidgetHeader({ id, title, children, showComponents = false }: Props) {
	const selectedWidgets = useLayoutStore((s) => s.selectedWidgets);
	const setSelectedWidgets = useLayoutStore((s) => s.setSelectedWidgets);
	const minimized = useLayoutStore((s) => s.minimized);
	const toggleMinimize = useLayoutStore((s) => s.toggleMinimize);
	const isMinimized = minimized[id] ?? false;

	return (
		<div className="flex items-center justify-between px-2 py-1">
			<div className="flex items-center gap-2 ">
				{showComponents && <span className="widget-drag cursor-move text-xs text-muted-foreground">☰</span>}
				<h3 className="text-sm font-medium">{title}</h3>
			</div>
			<div className="gap-2 flex">
				{children}
				{showComponents ? (
					<button className="cursor-pointer" aria-label="Sil" title="Sil" onClick={(e) => setSelectedWidgets(selectedWidgets.filter((x) => x !== id))}>
						<Icon IconComponent={Cross1Icon} iconClass="p-1" />
					</button>
				) : (
					<button onClick={() => toggleMinimize(id)} className="cursor-pointer flex items-start" aria-label={isMinimized ? "Expand widget" : "Minimize widget"}>
						{isMinimized ? <Icon IconComponent={Maximize2} iconClass="p-1" transparent={true} /> : <Icon IconComponent={Minus} iconClass="p-1" transparent={true} />}
					</button>
				)}
			</div>
		</div>
	);
}
