import { ThemeProvider } from "@/shared/components/theme-provider";
import { AppRouterProvider } from "./providers";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppRouterProvider />
    </ThemeProvider>
  );
}

export default App;
