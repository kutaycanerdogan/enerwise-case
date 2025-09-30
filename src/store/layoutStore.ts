import React from "react";
import { Layout } from "react-grid-layout";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WidgetId = "total-consumption" | "total-natural-gas-consumption-tep" | "total-carbon-footprint" | "total-natural-gas-consumption-sm3" | "total-steam-consumption" | "total-electricity-consumption" | "total-hot-water-consumption" | "total-water-consumption" | "total-electricity-production" | "multi-series-chart" | "department-consumption" | "capacitive-load";

export const allWidgets: { id: WidgetId; label: string; preview: string }[] = [
	{ id: "total-consumption", label: "Toplam Tüketim", preview: "27.414,69 kWh" },
	{ id: "total-natural-gas-consumption-tep", label: "Toplam Doğalgaz Tüketimi (TEP)", preview: "23,35 TEP" },
	{ id: "total-carbon-footprint", label: "Toplam Karbon Ayak İzi", preview: "118,99 tonCO₂" },
	{ id: "total-natural-gas-consumption-sm3", label: "Toplam Doğalgaz Tüketimi (Sm³)", preview: "2.536,00 Sm³" },
	{ id: "total-steam-consumption", label: "Toplam Buhar Tüketimi", preview: "536,00 kg" },
	{ id: "total-electricity-consumption", label: "Toplam Elektrik Tüketimi", preview: "456,03 kWh" },
	{ id: "total-hot-water-consumption", label: "Toplam Sıcak Su Tüketimi", preview: "3.536,01 kWh" },
	{ id: "total-water-consumption", label: "Toplam Su Tüketimi", preview: "356,03 m³" },
	{ id: "total-electricity-production", label: "Toplam Elektrik Üretimi", preview: "3.536,01 kWh" },
	{ id: "multi-series-chart", label: "Çok Serili Grafik", preview: "Kesim / LAM / Klima..." },
	{ id: "department-consumption", label: "Departman Tüketimleri", preview: "Kesim: 253.219,19 kWh" },
	{ id: "capacitive-load", label: "Kapasitif Yük", preview: "0%" },
];

export type WidgetProps = {
	id: WidgetId;
	title: string;
	kpiId?: string;
	icon?: React.ComponentType<any>;
	showComponents: boolean;
};

export type LayoutItem = {
	i: WidgetId;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
};

export type Layouts = {
	lg: LayoutItem[];
	md: LayoutItem[];
	sm: LayoutItem[];
};

type State = {
	layouts: Layouts;
	theme: "light" | "dark";
	selectedWidgets: WidgetId[];
	widgetsToAdd: WidgetId[];
	minimized: Record<WidgetId, boolean>;

	setLayout: (breakpoint: keyof Layouts, layout: Layout[]) => void;
	setTheme: (t: "light" | "dark") => void;
	setSelectedWidgets: (ids: WidgetId[]) => void;
	setWidgetsToAdd: (ids: WidgetId[]) => void;
	addWidgetToLayout: (ids: WidgetId | WidgetId[]) => void;
	toggleWidget: (id: WidgetId) => void;
	toggleMinimize: (id: WidgetId) => void;
	reset: () => void;
};

const STORAGE_KEY = "ew-dashboard-layouts-v1";

const initialLayouts: Layouts = { lg: [], md: [], sm: [] };
const initialMinimized: Record<WidgetId, boolean> = Object.fromEntries((["total-consumption", "total-natural-gas-consumption-tep", "total-carbon-footprint", "total-natural-gas-consumption-sm3", "total-steam-consumption", "total-electricity-consumption", "total-hot-water-consumption", "total-water-consumption", "total-electricity-production", "multi-series-chart", "department-consumption", "capacitive-load"] as WidgetId[]).map((id) => [id, false])) as Record<WidgetId, boolean>;
export const useLayoutStore = create<State>()(
	persist(
		(set, get) => ({
			layouts: initialLayouts,
			theme: "light",
			selectedWidgets: [],
			widgetsToAdd: [],
			minimized: {} as Record<WidgetId, boolean>,

			setLayout: (breakpoint, layout) => {
				const current = get().layouts;
				const next = { ...current, [breakpoint]: layout };
				localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { ...get(), layouts: next } }));
				set({ layouts: next });
			},

			removeAllComponents: () => {
				set(() => ({ layouts: initialLayouts }));
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed?.state?.layouts) {
						delete parsed.state.layouts;
						localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
					}
				}
			},

			setSelectedWidgets: (ids: WidgetId[]) => set({ selectedWidgets: ids }),
			setWidgetsToAdd: (ids: WidgetId[]) => set({ widgetsToAdd: ids }),

			addWidgetToLayout: (input: WidgetId | WidgetId[]) => {
				const { selectedWidgets, layouts } = get();

				const defaultSize = { w: 2, h: 5 };
				const newWidgets = Array.isArray(input) ? input : [input];

				const widgetsToAdd = newWidgets.filter((id) => !selectedWidgets.includes(id));
				const nextWidgets = [...selectedWidgets, ...widgetsToAdd];

				const generateLayout = (existing: LayoutItem[], cols: number): LayoutItem[] => {
					const usedPositions = [...existing];
					const next: LayoutItem[] = [];

					widgetsToAdd.forEach((wid) => {
						const index = usedPositions.length;
						const x = (index * defaultSize.w) % cols;
						const y = Math.floor((index * defaultSize.w) / cols) * defaultSize.h;
						const item = { i: wid, x, y, ...defaultSize };
						usedPositions.push(item);
						next.push(item);
					});

					return [...existing, ...next];
				};

				const nextLayouts: Layouts = {
					lg: generateLayout(layouts.lg, 12),
					md: generateLayout(layouts.md, 8),
					sm: generateLayout(layouts.sm, 1),
				};

				set({
					selectedWidgets: nextWidgets,
					layouts: nextLayouts,
				});
			},

			toggleWidget: (id) => {
				const exists = get().selectedWidgets.includes(id);
				const updated = exists ? get().selectedWidgets.filter((w) => w !== id) : [...get().selectedWidgets, id];
				set({ selectedWidgets: updated });
			},

			toggleMinimize: (id) => {
				const current = get().minimized[id] ?? false;
				set({
					minimized: {
						...get().minimized,
						[id]: !current,
					},
				});
			},

			setTheme: (t) => {
				const root = document.documentElement;
				if (t === "dark") root.classList.add("dark");
				else root.classList.remove("dark");
				set({ theme: t });
			},

			reset: () =>
				set({
					layouts: initialLayouts,
					theme: "light",
					minimized: initialMinimized,
				}),
		}),
		{
			name: STORAGE_KEY,
			partialize: (state) => ({
				layouts: state.layouts,
				selectedWidgets: state.selectedWidgets,
				minimized: state.minimized,
			}),
			onRehydrateStorage: () => {
				return (rehydratedState) => {
					useLayoutStore.setState({
						layouts: rehydratedState?.layouts ?? initialLayouts,
						selectedWidgets: rehydratedState?.selectedWidgets ?? allWidgets.slice(0, 2).map((x) => x.id),
						minimized: rehydratedState?.minimized ?? initialMinimized,
					});
				};
			},
		}
	)
);
