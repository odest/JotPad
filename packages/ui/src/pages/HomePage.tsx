import { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Sidebar } from "@repo/ui/views/Sidebar";
import { Settings } from "@repo/ui/views/Settings";
import { NoteContent } from "@repo/ui/views/NoteContent";
import { useNotes } from "@repo/ui/hooks/useNotes";
import { useSettings } from "@repo/ui/hooks/useSettings";
import { TagEditDialog } from "@repo/ui/components/note/TagEditDialog";
import { compareVersions, checkOnline, fetchLatestGithubVersion } from '@repo/ui/lib/utils';

export function HomePage() {
  const { t } = useTranslation();
  const {
    open,
    noteTitle, setNoteTitle,
    notes,
    editId,
    selectedNote,
    searchQuery, setSearchQuery,
    showSidebar, setShowSidebar,
    showSettings,
    noteIdToDelete, setNoteIdToDelete,
    duplicateTitleDialogOpen, setDuplicateTitleDialogOpen,
    tagManagerOpen, setTagManagerOpen,
    allGlobalTags,
    loadNotes,
    handleCreateNote,
    handleDeleteNote,
    handleOpenEditDialog,
    handleNoteSelect,
    openSettings,
    closeSettings,
    handleUpdateTag,
    handleDeleteTag,
    filteredNotes,
    SIDEBAR_HEADER_HEIGHT,
    handleDialogOpenChange,
    tags, setTags,
  } = useNotes();

  const [appVersion, setAppVersion] = useState<string | null>(null);
  const { autoCheckUpdates } = useSettings();

  useEffect(() => {
    getVersion().then(setAppVersion).catch(() => setAppVersion("-"));
  }, []);

  useEffect(() => {
    if (
      autoCheckUpdates && checkOnline()
    ) {
      (async () => {
        let currentVersion = appVersion;
        if (!currentVersion) {
          try {
            currentVersion = await getVersion();
          } catch {
            return;
          }
        }
        try {
          const latestTag = await fetchLatestGithubVersion();
          const current = currentVersion.replace(/^v/, '');
          if (!latestTag) return;
          const cmp = compareVersions(current, latestTag);
          if (cmp < 0) {
            toast.info(`A new version is available: v${latestTag}\nYou are using: v${current}`);
          }
        } catch (e) {
        }
      })();
    }
  }, [autoCheckUpdates, appVersion]);

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        filteredNotes={filteredNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: new Date(note.created_at),
          lastEntryText: note.lastEntryText,
          tags: note.tags || [],
        }))}
        selectedNote={selectedNote ? {
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
          createdAt: new Date(selectedNote.created_at),
          lastEntryText: selectedNote.lastEntryText,
          tags: selectedNote.tags || [],
        } : null}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleNoteSelect={(noteFromList) => {
          const originalNote = notes.find(n => n.id === noteFromList.id);
          if (originalNote) {
            handleNoteSelect(originalNote);
          }
        }}
        open={open}
        setOpen={handleDialogOpenChange}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        handleCreateNote={handleCreateNote}
        showSidebar={showSidebar}
        handleEditNote={(noteFromList) => {
          const originalNote = notes.find(n => n.id === noteFromList.id);
          if (originalNote) {
            handleOpenEditDialog(originalNote);
          }
        }}
        handleDeleteNote={(id) => setNoteIdToDelete(id)}
        onToggleSettings={openSettings}
        isEdit={!!editId}
        tags={tags}
        setTags={setTags}
        allGlobalTags={allGlobalTags}
        onOpenTagManager={() => setTagManagerOpen(true)}
      />
      {showSettings ? (
        <Settings
          onClose={closeSettings}
          SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
        />
      ) : (
        <NoteContent
          selectedNote={selectedNote}
          handleEditNote={handleOpenEditDialog}
          handleDeleteNote={(id) => setNoteIdToDelete(id)}
          setShowSidebar={setShowSidebar}
          SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
          onEntryAdded={loadNotes}
          showSidebar={showSidebar}
        />
      )}
      <Dialog open={!!noteIdToDelete} onOpenChange={open => { if (!open) setNoteIdToDelete(null); }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('delete_note')}</DialogTitle>
          </DialogHeader>
          <div>{t('delete_note_confirm')}</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setNoteIdToDelete(null)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (noteIdToDelete) {
                  await handleDeleteNote(noteIdToDelete);
                  setNoteIdToDelete(null);
                }
              }}
            >
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={duplicateTitleDialogOpen} onOpenChange={setDuplicateTitleDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('duplicate_note_title')}</DialogTitle>
          </DialogHeader>
          <div>{t('duplicate_note_title_desc')}</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setDuplicateTitleDialogOpen(false)} autoFocus>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TagEditDialog
        open={tagManagerOpen}
        onOpenChange={setTagManagerOpen}
        tags={allGlobalTags}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}