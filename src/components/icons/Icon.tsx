import { ReactNode } from "react";

type Props = {
	IconComponent: React.ComponentType<any>;
	iconWrapperClass?: string;
	iconClass?: string;
	transparent?: boolean;
	w?: string;
	h?: string;
	isRounded?: boolean;
	hasWrapper?: boolean;
};

function Icon({ IconComponent, iconWrapperClass, iconClass, transparent = false, w = "24px", h = "24px", isRounded = true, hasWrapper = true }: Props) {
	const IconComp: ReactNode = <IconComponent className={`p-1 ${transparent ? "text-chart-2" : "bg-chart-2 text-white"} rounded-${isRounded ? "full" : "none"} ${iconClass}`} width={w} height={h} />;

	return hasWrapper ? <div className={iconWrapperClass}>{IconComp}</div> : IconComp;
}

export default Icon;
