import { Button } from "@repo/ui/components/button";
import { ChevronLeft, Star, Construction } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-4 bg-black">

      <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-6 drop-shadow-lg animate-fade-in-up delay-100">
        JotPad Web App
      </h1>

      <div className="text-xl md:text-3xl font-bold text-white text-center mb-8 italic tracking-wide animate-fade-in-up delay-200">
        Web App Coming Soon!
      </div>

      <p className="text-base md:text-lg text-white text-center max-w-2xl mb-10 animate-fade-in-up delay-400">
        This page belongs to the JotPad web application. The project is currently under development and not available for use yet. Very soon, you&apos;ll be able to take notes right here! Stay tuned for updates.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up delay-500">
        <Link href="https://jotpad.odest.tech/">
          <Button size="lg" className="gap-2 bg-white text-black px-6 py-5 text-lg shadow-xl border border-white hover:bg-black hover:text-white hover:scale-105 hover:shadow-2xl transition-transform duration-200">
            <ChevronLeft className="w-5 h-5" /> Go Back Home
          </Button>
        </Link>
        <Link href="https://github.com/odest/JotPad" target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="outline" className="gap-2 border-white text-white px-6 py-5 text-lg bg-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl transition-transform duration-200">
            <Star className="w-5 h-5" /> Star on GitHub
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-6 -translate-x-1/2 text-xs text-white bg-black px-4 py-2 rounded-full border border-white shadow backdrop-blur-md animate-fade-in-up delay-700 flex items-center gap-2">
        <Construction className="w-4 h-4" />
        Our web app is under development. We&apos;ll be here very soon!
        <Construction className="w-4 h-4" />
      </div>
    </main>
  );
}
