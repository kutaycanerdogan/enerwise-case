import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import type { DateRange } from "react-day-picker";

export function DateRangePicker({ range, setRange }: { range: DateRange; setRange: (r: DateRange) => void }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="px-2 py-1 h-8 text-xs">
					<CalendarIcon className="mr-1 h-3 w-3" />
					{range.from && range.to ? `${format(range.from, "dd-MM-yyyy")} → ${format(range.to, "dd-MM-yyyy")}` : "Tarih Aralığı Seç"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="range" selected={range} onSelect={(r) => setRange(r ?? { from: undefined, to: undefined })} numberOfMonths={2} initialFocus />
			</PopoverContent>
		</Popover>
	);
}
