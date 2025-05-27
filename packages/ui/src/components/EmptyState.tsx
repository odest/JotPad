import { Notebook } from "lucide-react";

interface EmptyStateProps {
  showSidebar: boolean;
}

export function EmptyState({ showSidebar }: EmptyStateProps) {
  return (
    <div className={`relative flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl overflow-hidden ${!showSidebar ? 'block' : 'hidden md:block'} bg-background`}>
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="flex flex-col items-center justify-center">
          <Notebook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-center">Select a note</h3>
          <p className="text-gray-500 mt-2 text-center">Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    </div>
  );
}