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

export function HomePage() {
  const {
    open, setOpen,
    noteTitle, setNoteTitle,
    notes,
    editId,
    selectedNote,
    searchQuery, setSearchQuery,
    showSidebar,
    showSettings,
    noteIdToDelete, setNoteIdToDelete,
    duplicateTitleDialogOpen, setDuplicateTitleDialogOpen,
    handleCreateNote,
    handleDeleteNote,
    handleOpenEditDialog,
    handleNoteSelect,
    openSettings,
    closeSettings,
    filteredNotes,
    SIDEBAR_HEADER_HEIGHT,
    handleDialogOpenChange,
  } = useNotes();

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        filteredNotes={filteredNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: new Date(note.created_at),
          lastEntryText: note.lastEntryText,
        }))}
        selectedNote={selectedNote ? {
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
          createdAt: new Date(selectedNote.created_at),
          lastEntryText: selectedNote.lastEntryText,
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
          setShowSidebar={v => {}}
          SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
          onEntryAdded={() => {}}
          showSidebar={showSidebar}
        />
      )}
      <Dialog open={!!noteIdToDelete} onOpenChange={open => { if (!open) setNoteIdToDelete(null); }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this note? This action cannot be undone.</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setNoteIdToDelete(null)}>
              Cancel
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={duplicateTitleDialogOpen} onOpenChange={setDuplicateTitleDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Duplicate Note Title</DialogTitle>
          </DialogHeader>
          <div>A note with the same title already exists. Please enter a different title.</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setDuplicateTitleDialogOpen(false)} autoFocus>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}