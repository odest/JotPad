import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { HomePage } from "@repo/ui/pages/HomePage";
import { NotesPage } from "@repo/ui/pages/NotesPage";
import "@repo/ui/globals.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jotpad-theme">
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
