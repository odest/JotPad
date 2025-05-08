import { Button } from "@repo/ui/components/button";
import { Globe, Star, Construction } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-4 bg-black">

      <h1 className="text-6xl md:text-8xl font-extrabold text-white text-center mb-6 drop-shadow-lg animate-fade-in-up delay-100">
        JotPad
      </h1>

      <div className="text-2xl md:text-4xl font-bold text-white text-center mb-10 italic tracking-wide animate-fade-in-up delay-200">
        Take Notes Like a Conversation
      </div>

      <p className="text-base md:text-lg text-white text-center max-w-2xl mb-14 animate-fade-in-up delay-400">
        JotPad is an open-source, cross-platform note-taking app that lets you message yourself—just like a chat. Capture ideas, organize thoughts, and access your notes anywhere: web, desktop, or mobile.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up delay-500">
        <Link href="/app">
          <Button size="lg" className="gap-2 bg-white text-black px-6 py-5 text-lg shadow-xl border border-white hover:bg-black hover:text-white hover:scale-105 hover:shadow-2xl transition-transform duration-200">
            <Globe className="w-5 h-5" /> Launch Web App
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
        This project is currently under development. Stay tuned for updates!
        <Construction className="w-4 h-4" />
      </div>
    </main>
  );
}
