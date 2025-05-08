import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog"
import { Input } from "@repo/ui/components/input"
import { Plus, NotebookText } from "lucide-react";
import { useState } from "react";

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full py-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Notes</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-8">
          <div className="flex flex-col items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-transparent border-2 border-gray-200 flex items-center justify-center">
              <NotebookText className="w-20 h-20 text-gray-100" />
            </div>
            <div>
              <p className="text-2xl font-semibold">You haven't created any notes yet.</p>
              <p className="text-xl font-semibold italic mt-5">Start creating now!</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5" /> Create Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Enter a title for your note and click create to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="name" 
                    placeholder="Enter note title..." 
                    className="col-span-4"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  onClick={() => setOpen(false)}
                  disabled={!noteTitle.trim()}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 