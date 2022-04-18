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
  let updatedFlashcards: Flashcard[] = [];
  for (const flashcard of flashcards) {
    if (flashcard.id) {
      updatedFlashcards.push(flashcard);
      continue;
    }
    const note = await read(flashcard.file);
    const id = uuid().replace("_", "-");
    const updatedNote = addIdToNote({ id: id, flashcard, note });
    await save(flashcard.file, updatedNote);
    updatedFlashcards.push({
      ...flashcard,
      id,
    });
  }
  return updatedFlashcards;
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
