import { App, getAllTags, TFile } from "obsidian";
import Flashcard from "../entities/Card";
import parseInline from "./parseInline";

export interface ParseRequest {
  app: App;
  tagsToReview: string[];
  // TODO: add parsers as parameters
}

async function parse(request: ParseRequest): Promise<Flashcard[]> {
  const { app, tagsToReview } = request;
  let notes = app.vault.getMarkdownFiles();
  const todayDate = window.moment(Date.now()).format("YYYY-MM-DD");
  const cardPromises = notes.flatMap(async (note) => {
    const cachedMetadata = app.metadataCache.getFileCache(note) || {};
    const tags = getAllTags(cachedMetadata) || [];
    for (let tag of tags) {
      // TODO: add support for hierarchical tags. For example #flashcards/subdeck/subdeck
      if (tagsToReview.includes(tag)) {
        return flashcardsFromNote(note, tag, app);
      }
    }
    return [];
  });

  const cards = await Promise.all(cardPromises);
  return cards.flatMap((c) => c);
}

async function flashcardsFromNote(
  note: TFile,
  tag: string,
  app: App
): Promise<Flashcard[]> {
  let text = await app.vault.read(note);
  const flashcards = parseInline({ note: text, file: note });
  return flashcards;
}

export default parse;
