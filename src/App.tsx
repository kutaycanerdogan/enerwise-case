import { useEffect } from "react";
import { useLayoutStore } from "./store/layoutStore";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
	const theme = useLayoutStore((s) => s.theme);
	const setTheme = useLayoutStore((s) => s.setTheme);

	useEffect(() => {
		setTheme(theme);
	}, []);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="h-screen min-h-screen bg-background text-foreground">
				<Dashboard />
			</div>
		</ThemeProvider>
	);
}
