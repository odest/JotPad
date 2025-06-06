import { useState, ComponentType, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@repo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { FileJson, FileCode, FileType, Check, Download } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Note } from "@repo/ui/lib/database";

export type ExportFormat = "json" | "txt" | "md";

export interface ExportFormatOption {
  value: ExportFormat;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  mimeType: string;
  extension: string;
}

export const exportFormats: ExportFormatOption[] = [
  { value: "json", label: "json", Icon: FileJson, mimeType: "application/json", extension: "json" },
  { value: "txt", label: "plain_text", Icon: FileType, mimeType: "text/plain", extension: "txt" },
  { value: "md", label: "markdown", Icon: FileCode, mimeType: "text/markdown", extension: "md" },
];

interface ExportNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onConfirmExport: (format: ExportFormat, note: Note) => void;
  defaultFormat?: ExportFormat;
}

export function ExportNoteDialog({
  isOpen,
  onOpenChange,
  note,
  onConfirmExport,
  defaultFormat = "json",
}: ExportNoteDialogProps) {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat);
  const currentFormatDetails =
    exportFormats.find((f) => f.value === selectedFormat)!;

  useEffect(() => {
    if (isOpen) setSelectedFormat(defaultFormat);
  }, [isOpen, defaultFormat]);

  const handleExportClick = () => {
    onConfirmExport(selectedFormat, note);
    onOpenChange(false);
  };

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('export_note')}: "{note.title}"</DialogTitle>
          <DialogDescription>
            {t('export_notes_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">{t('export_format')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('export_format_desc')}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="w-[160px] justify-start text-sm">
                  <currentFormatDetails.Icon className="mr-2 h-4 w-4" />
                  <span>{t(currentFormatDetails.label)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {exportFormats.map((format) => (
                  <DropdownMenuItem
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={cn(selectedFormat === format.value && "bg-accent")}
                  >
                    <format.Icon className="mr-2 h-4 w-4" />
                    <span>{t(format.label)}</span>
                    {selectedFormat === format.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleExportClick}>
            <Download className="mr-2 h-4 w-4" />
            {t('export_as', { format: t(currentFormatDetails.label) })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}