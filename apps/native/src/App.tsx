import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { HomePage } from "@repo/ui/pages/HomePage";
import "@repo/ui/globals.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
