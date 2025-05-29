import { ThemeProvider } from "@repo/ui/providers/theme-provider";
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
