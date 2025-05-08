import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@repo/ui/components/card";

interface NoteCardProps {
  title: string;
  content?: string;
  createdAt: Date;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ title, content, createdAt, onEdit, onDelete }: NoteCardProps) {
  const handleClick = () => {
    console.log({ title, content, createdAt });
  };
  return (
    <Card
      className="w-full max-w-xl cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <h3 className="text-lg font-semibold truncate overflow-hidden whitespace-nowrap max-w-[70%]">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit && onEdit(); }}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-row items-start justify-between space-y-0">
        <p className="text-sm text-gray-400 ">
          {content || "No notes added yet"}
        </p>
        <p className="text-sm text-gray-500 italic">
          {createdAt.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </CardContent>
    </Card>
  );
} 