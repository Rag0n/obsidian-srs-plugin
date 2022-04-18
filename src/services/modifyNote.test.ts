import Flashcard from "src/entities/Card";
import { addIdToNote } from "./modifyNote";

describe("addIdToNote", () => {
  describe("inline note", () => {
    it("adds id to note", () => {
      const flashcard: Flashcard = {
        question: "question",
        answer: "answer",
        file: "file stub",
      };
      const note = `
      before
      My question :: My answer
      after
      `;
      const newNote = addIdToNote({ id: "123456", flashcard, note });
      expect(newNote).toEqual(`
      before
      My question :: My answer ^123456
      after
      `);
    });
  });
});

describe("processNewFlashcards", () => {});
