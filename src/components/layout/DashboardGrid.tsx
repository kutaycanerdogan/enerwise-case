import { WidthProvider, Responsive, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { LayoutItem, Layouts, useLayoutStore, WidgetId } from "../../store/layoutStore";
import KpiCardWidget from "../widgets/KpiCardWidget";
import ChartWidget from "../widgets/ChartWidget";
import DepartmentsWidget from "../widgets/DepartmentsWidget";
import CapacitiveWidget from "../widgets/CapacitiveWidget";
import React, { JSX, useEffect, useRef, useCallback, useMemo } from "react";
import { Cable, Dam, Droplet, Flame, Footprints, Fuel, Waves, Zap, Minus, Maximize2 } from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);
type WidgetMap = Record<WidgetId, JSX.Element>;

const breakpoints = { lg: 1280, md: 1024, sm: 640 };
const cols = { lg: 12, md: 8, sm: 1 };

type DashboardProps = { showComponents: boolean };

function DashboardGrid({ showComponents }: DashboardProps) {
	const hasMounted = useRef(false);

	const layouts = useLayoutStore((s) => s.layouts);
	const setLayout = useLayoutStore((s) => s.setLayout);
	const selectedWidgets: WidgetId[] = useLayoutStore((s) => s.selectedWidgets);

	useEffect(() => {
		hasMounted.current = true;
	}, []);

	const handleLayoutChange = useCallback(
		(_: Layout[], allLayouts: Partial<Record<keyof Layouts, Layout[]>>) => {
			Object.entries(allLayouts).forEach(([bp, layout]) => {
				if (layout) {
					setLayout(bp as keyof Layouts, layout);
				}
			});
		},
		[setLayout]
	);

	const widgetMap: WidgetMap = useMemo(
		() => ({
			"total-consumption": <KpiCardWidget id="total-consumption" title="Toplam Tüketimi" kpiId="totalConsumption" icon={Cable} showComponents={showComponents} />,
			"total-natural-gas-consumption-tep": <KpiCardWidget id="total-natural-gas-consumption-tep" title="Toplam Doğalgaz Tüketimi (TEP)" kpiId="totalGasTEP" icon={Fuel} showComponents={showComponents} />,
			"total-carbon-footprint": <KpiCardWidget id="total-carbon-footprint" title="Toplam Karbon Ayak İzi" kpiId="totalCarbon" icon={Footprints} showComponents={showComponents} />,
			"total-natural-gas-consumption-sm3": <KpiCardWidget id="total-natural-gas-consumption-sm3" title="Toplam Doğalgaz Tüketimi (Sm³)" kpiId="totalGasSm3" icon={Flame} showComponents={showComponents} />,
			"total-steam-consumption": <KpiCardWidget id="total-steam-consumption" title="Toplam Buhar Tüketimi" kpiId="totalSteam" icon={Waves} showComponents={showComponents} />,
			"total-electricity-consumption": <KpiCardWidget id="total-electricity-consumption" title="Toplam Elektrik Tüketimi" kpiId="totalElectricity" icon={Zap} showComponents={showComponents} />,
			"total-hot-water-consumption": <KpiCardWidget id="total-hot-water-consumption" title="Toplam Sıcak Su Tüketimi" kpiId="totalHotWater" icon={Dam} showComponents={showComponents} />,
			"total-water-consumption": <KpiCardWidget id="total-water-consumption" title="Toplam Su Tüketimi" kpiId="totalWater" icon={Droplet} showComponents={showComponents} />,
			"total-electricity-production": <KpiCardWidget id="total-electricity-production" title="Toplam Elektrik Üretimi" kpiId="totalElectricityProduction" icon={Zap} showComponents={showComponents} />,
			"multi-series-chart": <ChartWidget id="multi-series-chart" title="Elektrik Tüketimi" showComponents={showComponents} />,
			"department-consumption": <DepartmentsWidget id="department-consumption" title="Bölümlerin Enerji Tüketimleri" showComponents={showComponents} />,
			"capacitive-load": <CapacitiveWidget id="capacitive-load" title="Kapasitif" showComponents={showComponents} />,
		}),
		[showComponents]
	);

	const handleDrop = useCallback((layout: Layout[], item: Layout, e: DragEvent) => {
		const id = e.dataTransfer?.getData("text/plain");
		if (!id) return;

		const { layouts, selectedWidgets } = useLayoutStore.getState();
		if (selectedWidgets.includes(id as WidgetId)) return;

		const newItem: LayoutItem = {
			i: id as WidgetId,
			x: item.x ?? 0,
			y: item.y ?? 0,
			w: 2,
			h: 4,
		};

		const nextLayouts: Layouts = {
			lg: [...layouts.lg, newItem],
			md: [...layouts.md, { ...newItem, x: newItem.x % 8 }],
			sm: [...layouts.sm, { ...newItem, x: 0 }],
		};

		useLayoutStore.setState({
			selectedWidgets: [...selectedWidgets, id as WidgetId],
			layouts: nextLayouts,
		});
	}, []);

	return (
		<div className="relative h-full" aria-label="Widget Grid" role="region" style={{ minHeight: showComponents ? "300px" : "450px" }}>
			{selectedWidgets.length === 0 && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none text-gray-400 text-xl">Bileşen eklemek için Gösterge Panel'indeki Bileşenler switch'ini açınız. Ardından eklemek istediğiniz bileşeni seçerek Dashboard'a ekleyebilirsiniz.</div>}

			<ResponsiveGridLayout className="layout" rowHeight={12} measureBeforeMount={false} isDraggable isResizable={showComponents} breakpoints={breakpoints} cols={cols} layouts={layouts} onLayoutChange={handleLayoutChange} draggableHandle=".widget-drag" aria-label="Sürükle-bırak grid" isDroppable={showComponents} onDrop={handleDrop}>
				{selectedWidgets.map((key) => {
					return (
						<div key={key} className="card overflow-hidden focus-visible:ring-2 focus-visible:ring-ring h-full relative" tabIndex={0} role="group" aria-label={`Widget: ${key}`}>
							{widgetMap[key]}
						</div>
					);
				})}
			</ResponsiveGridLayout>
		</div>
	);
}

export default React.memo(DashboardGrid);
