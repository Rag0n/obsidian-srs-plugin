import { recall, updateProbabilities } from "./scheduler";
import { Model } from "ebisu-js";
import Flashcard from "../entities/Card";

describe("recall", () => {
  const basicCard: Flashcard = {
    question: 'question',
    answer: 'answer',
    file: 'file stub'
  }

  describe("when card have not been recalled yet", () => {
    const card = basicCard

    it('returns card with recall filled in', () => {
      const updatedCard = recall({ card, remember: true})
      expect(updatedCard.recall.time).not.toBeNull()
    })

    it('return card with model', () => {
      const updatedCard = recall({ card, remember: true})
      expect(updatedCard.recall.model).not.toBeNull()
    })
  });
 
  describe("when card was recalled 24h ago", () => {
    const modelBeforeRecall = [1.5, 1.5, 24] as Model
    const timeBeforeRecall = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const card = {
      ...basicCard,
      recall: {
        model: modelBeforeRecall,
        time: timeBeforeRecall
      }
    } 

    it('updates model', () => {
      const updatedCard = recall({ card, remember: true})
      expect(updatedCard.recall.model).not.toEqual(modelBeforeRecall)
    })

    it('updates recall time', () => {
      const updatedCard = recall({ card, remember: true})
      expect(updatedCard.recall.model).not.toEqual(timeBeforeRecall)
    })
  })
});

describe("updateProbabilities", () => {
  const cardWithoutRecall = {
    question: 'question1',
    answer: 'answer1',
    file: 'file'
  }
  const cardWithoutRecall2 = {
    question: 'question2',
    answer: 'answer2',
    file: 'file'
  }
  const cardWithRecall = {
    question: 'question3',
    answer: 'answer3',
    file: 'file',
    recall: {
      model: [1.5, 1.5, 24] as Model,
      time: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  }
  const cardWithRecall2 = {
    question: 'question4',
    answer: 'answer4',
    file: 'file',
    recall: {
      model: [1.5, 1.5, 24] as Model,
      time: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    }
  }

  describe('when cards was not recalled yet', () => {
    it('returns card with same order', () =>{
      const cards = [cardWithoutRecall, cardWithoutRecall2]
      const updatedCards = updateProbabilities({ cards })
      expect(updatedCards).toEqual(cards)
    })
  })

  describe('when first card was recalled and second card was not recalled yet', () => {
    it('returns not recalled card on first position', () => {
      const cards = [cardWithRecall, cardWithoutRecall]
      const updatedCards = updateProbabilities({ cards })
      expect(updatedCards).toEqual([cardWithoutRecall, cardWithRecall])
    })
  })

  describe('when first card was not recalled and second card was recalled', () => {
    it('returns not recalled card on first position', () => {
      const cards = [cardWithoutRecall, cardWithRecall]
      const updatedCards = updateProbabilities({ cards })
      expect(updatedCards).toEqual([cardWithoutRecall, cardWithRecall])
    })
  })

  describe('when first card was recalled 24h ago and second card was recalled 48h ago', () => {
    it('returns card with later recalled time on first position', () => {
      const cards = [cardWithRecall, cardWithRecall2]
      const updatedCards = updateProbabilities({ cards })
      expect(updatedCards).toEqual([cardWithRecall2, cardWithRecall])
    })
  })

  describe('when first card was recalled 48h ago and second card was recalled 24h ago', () => {
    it('returns card with later recalled time on first position', () => {
      const cards = [cardWithRecall2, cardWithRecall]
      const updatedCards = updateProbabilities({ cards })
      expect(updatedCards).toEqual([cardWithRecall2, cardWithRecall])
    })
  })
})