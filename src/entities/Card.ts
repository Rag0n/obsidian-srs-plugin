import { map, then, many, stringify, or, manyTill } from "parjs/combinators";
import { anyChar, string } from "parjs";

export interface Card {
  question: any;
  answer: any;
}

function parseInline(note: string): Card | null {
  const stringParser = anyChar().pipe(many(), stringify());
  const separatorParser = string(" :: ").pipe(
    or(string(":: "), string(" ::"), string("::"))
  );
  const inlineParser = anyChar().pipe(
    manyTill(separatorParser),
    stringify(),
    then(stringParser),
    map(([question, answer]) => {
      return {
        question,
        answer,
      };
    })
  );

  const result = inlineParser.parse(note);
  if (result.isOk) {
    return result.value;
  } else {
    console.log("result", result);
    return null;
  }
}

export default parseInline;
