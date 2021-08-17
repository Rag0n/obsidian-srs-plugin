import * as ebisu from "ebisu-js";
import Card from "../entities/Card";

/*
  defaultModel(t, alpha=1.5, beta=1.5)
  Convert recall probability prior's raw parameters into a model object.
  `t` is your guess as to the half-life of any given fact, in units that you
  must be consistent with throughout your use of Ebisu.
  `alpha` and `beta` are the parameters of the Beta distribution that describe
  your beliefs about the recall probability of a fact `t` time units after that
  fact has been studied/reviewed/quizzed. If they are the same, `t` is a true
  half-life, and this is a recommended way to create a default model for all
  newly-learned facts. If `beta` is omitted, it is taken to be the same as
  `alpha`.
*/
const defaultModel = ebisu.defaultModel(24, 1.5, 1.5);

export interface ScheduleRequest {
  card: Card;
  remember: boolean;
}

export interface UpdateProbabilitiesRequest {
  cards: Card[];
}

function elapsed(s: string, now: number) {
  return (now - new Date(s).valueOf()) / 3600e3;
}

export function updateProbabilities({
  cards,
}: UpdateProbabilitiesRequest): Card[] {
  const now = Date.now();
  let cardsWithProbability = cards.map((card) => {
    if (card.recall) {
      const recallProbability = ebisu.predictRecall(
        card.recall.model,
        elapsed(card.recall.time, now)
      );
      return {
        card: card,
        recallProbability: recallProbability,
      };
    } else {
      return {
        card: card, 
        recallProbability: -Infinity
      };
    }
  });
  let sortedCardsWithProbability = cardsWithProbability.sort(
    (a, b) => a.recallProbability - b.recallProbability
  );
  return sortedCardsWithProbability.map((cardWithProbability) => cardWithProbability.card);
}

export function recall({ card, remember }: ScheduleRequest): Card {
  const now = new Date();
  const updatedModel = card.recall
    ? ebisu.updateRecall(
        card.recall.model,
        +remember,
        1,
        elapsed(card.recall.time, now.valueOf())
      )
    : defaultModel;
  const updatedCard = {
    ...card,
    recall: {
      model: updatedModel,
      time: now.toISOString(),
    },
  };
  return updatedCard;
}
