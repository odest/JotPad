import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotesPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-10 p-16 w-full flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold">Notes Page</h1>
        <p className="text-3xl">This is where you can manage your notes.</p>
        <Link to="/">
          <Button size="lg" className="gap-2 bg-white text-black px-6 py-5 text-lg shadow-xl border border-white hover:bg-black hover:text-white hover:scale-105 hover:shadow-2xl">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 