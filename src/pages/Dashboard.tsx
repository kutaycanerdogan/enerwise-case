import { useState, useMemo } from "react";
import { useLayoutStore } from "../store/layoutStore";
import DashboardGrid from "@/components/layout/DashboardGrid";
import WidgetPicker from "@/components/controls/WidgetPicker";
import { SunIcon, MoonIcon, DashboardIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/icons/Icon";

export default function Dashboard() {
	const theme = useLayoutStore((s) => s.theme);
	const setTheme = useLayoutStore((s) => s.setTheme);
	const selectedWidgets = useLayoutStore((s) => s.selectedWidgets);

	const [query, setQuery] = useState("");
	const [showComponents, setShowComponents] = useState(false);

	const themeLabel = useMemo(() => (theme === "light" ? "Koyu" : "Açık"), [theme]);

	return (
		<main aria-label="Enerji Yönetim Paneli" className="mx-auto px-4 py-4 bg ">
			<section className="toolbar bg-card card mb-4 h-[10%]" role="heading" aria-label="Başlık">
				<div className="flex items-center justify-between gap-2 w-11/12">
					<h2 className="">Gösterge Paneli </h2>
					<div className="flex items-center space-x-2">
						<Icon IconComponent={DashboardIcon} transparent={true} w={"24px"} h={"24px"} isRounded={false} />
						<Label htmlFor="components">Bileşenler</Label>
						<Switch id="components" className="bg-background data-[state=checked]:bg-blue-500" defaultChecked={showComponents} onCheckedChange={() => setShowComponents(!showComponents)} />
					</div>
				</div>
				<div className="flex-row-reverse">
					<button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm " onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-pressed={theme === "dark"}>
						{theme === "light" ? <MoonIcon width={32} height={32} /> : <SunIcon width={32} height={32} />}
						<span>{themeLabel}</span>
					</button>
				</div>
			</section>
			{showComponents && (
				<section className="toolbar card flex flex-col items-start mb-4" aria-label="Bileşenler">
					<div className="w-full">
						<div className="flex justify-content-between align-items-center">
							<div className="mb-4 w-full">
								<div className="flex justify-between">
									<h2>Bileşenler</h2>
									<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Widget ara..." className="rounded-md border border-input bg-background px-3 py-2 text-sm" aria-label="Widget arama" />
								</div>
								<div className="flex">
									<span>Alttaki menüden dilediğiniz bileşeni yanındaki</span>
									<span className="px-1">
										<Icon IconComponent={PlusCircledIcon} transparent={true} hasWrapper={false} />
									</span>
									<span>butonuna tıklayarak ya da sürükleyerek</span>
									<strong className="px-1">İzleme Sayfanıza</strong>
									<span>ekleyebilirsiniz.</span>
								</div>
							</div>
						</div>
						<div className="ml-auto">
							<WidgetPicker filterQuery={query} />
						</div>
					</div>
					<div></div>
				</section>
			)}
			<section className={`card mb-4`} aria-label="Bileşenler" style={{ minHeight: showComponents ? "300px" : "450px" }}>
				<DashboardGrid showComponents={showComponents} />
				{/* {selectedWidgets.length === 0 && (
					<div className="flex flex-col items-center justify-center min-h-64">
						<div>Bileşen eklemek için Gösteri Panel'indeki Bileşenler switch'ini açınız. Ardından eklemek istediğiniz bileşeni seçerek Widget List'e ekleyebilirsiniz.</div>
					</div>
				)} */}
			</section>
		</main>
	);
}
