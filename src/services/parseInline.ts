import {
  str,
  choice,
  char,
  coroutine,
  many,
  everyCharUntil,
  endOfInput,
  sepBy,
  either,
} from "arcsecond";

import Flashcard from "../entities/Card";

export interface ParseInlineRequest {
  note: string;
  file: any; // TFile
}

function parseInline({ note, file }: ParseInlineRequest): Flashcard[] | null {
  const separator = str("::");
  const questionParser = everyCharUntil(
    choice([separator, char("\n"), endOfInput])
  );
  const answerParser = everyCharUntil(
    choice([separator, char("\n"), char("^"), endOfInput])
  );
  const idParser = everyCharUntil(choice([char("\n"), endOfInput]));
  const lineParser = coroutine(function* () {
    const question: string | number[] = yield questionParser;
    yield str("::");
    const answer: string | number[] = yield answerParser;
    const id: string = yield idParser;
    const formattedId = id === "" ? null : id.substring(1).trim();

    return {
      id: formattedId,
      file: file,
      question:
        typeof question === "string" ? question.trim() : question.toString(),
      answer: typeof answer === "string" ? answer.trim() : answer.toString(),
    };
  });

  const fullParser = many(sepBy(char("\n"))(either(lineParser)));

  const result = fullParser.fork(
    note,
    (error, parsingResult) => {
      console.log("error", error);
      return [];
    },
    (result, parsingResult) => {
      return result
        .flatMap((x) => x)
        .flatMap((result: any) => {
          if (result.isError) {
            return [];
          } else {
            return result.value;
          }
        });
    }
  ) as Flashcard[];

  return result;
}

export default parseInline;
