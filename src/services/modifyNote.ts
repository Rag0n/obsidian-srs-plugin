import Flashcard from "src/entities/Card";

export interface ProcessNewFlashcardsRequest {
  flashcards: Flashcard[];
  read: (file: any) => Promise<string>;
  save: (file: any, note: string) => Promise<void>;
  uuid: () => string;
}

export async function processNewFlashcards({
  flashcards,
  read,
  save,
  uuid,
}: ProcessNewFlashcardsRequest) {
  const updatedFlashcards = await Promise.all(
    flashcards.map(async (flashcard) => {
      if (flashcard.id) {
        return flashcard
      }
      const note = await read(flashcard.file);
      const id = uuid();
      const updatedNote = addIdToNote({ id: uuid(), flashcard, note });
      await save(flashcard.file, updatedNote);
      return {
        ...flashcard,
        id,
      };
    })
  );
  return updatedFlashcards
}

export interface AddIdToNoteRequest {
  id: string;
  flashcard: Flashcard;
  note: string;
}

export function addIdToNote({ id, flashcard, note }: AddIdToNoteRequest) {
  const newAnswer = flashcard.answer + " ^" + id;
  return note.replace(flashcard.answer, newAnswer);
}
