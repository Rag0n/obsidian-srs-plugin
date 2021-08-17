import { Model } from "ebisu-js";
// import { TFile } from "obsidian"
export default interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  file: any; // TFile
  recall?: {
    model: Model,
    time: string; // ISO time
  }
}
