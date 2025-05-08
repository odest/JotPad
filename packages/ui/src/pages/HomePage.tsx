import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-10 p-16 w-full flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold">Home Page</h1>
        <p className="text-3xl">Welcome to your Tauri application!</p>
        <Link to="/notes">
          <Button size="lg" className="gap-2 bg-white text-black px-6 py-5 text-lg shadow-xl border border-white hover:bg-black hover:text-white hover:scale-105 hover:shadow-2xl">
            <ArrowRight className="w-5 h-5" /> Go to Notes
          </Button>
        </Link>
      </div>
    </div>
  );
} 