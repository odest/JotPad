import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@repo/ui/pages/HomePage";
import { NotesPage } from "@repo/ui/pages/NotesPage";
import "@repo/ui/globals.css";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
