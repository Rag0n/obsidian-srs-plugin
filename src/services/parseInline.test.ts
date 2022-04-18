import parseInline from "./parseInline";

describe('inline parser', () => {
  const file = 'file stub'

  it('parses inline card', () => {
    const note = "My question::My answer"
    const cards = parseInline({ note, file })
    const card = cards[0]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  it('parses inline card with whitespace left to separator', () => {
    const note = "My question ::My answer"
    const cards = parseInline({ note, file })
    const card = cards[0]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  it('parses inline card with whitespace right to separator', () => {
    const note = "My question:: My answer"
    const cards = parseInline({ note, file })
    const card = cards[0]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  it('parses inline card with whitespace around separator', () => {
    const note = "My question :: My answer"
    const cards = parseInline({ note, file })
    const card = cards[0]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  it('parses inline card inside multiline text', () => {
    const note = `
    before
    My question :: My answer
    after
    My question :: My answer
    `
    const cards = parseInline({ note, file })
    const card = cards[1]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  it.skip('parses inline card in a list', () => {
    const note = "- My question :: My answer"
    const cards = parseInline({ note, file })
    const card = cards[0]
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
    expect(card!.id).toBeNull()
  })

  describe('when note has card id', () => {
    it('parses inline card and assignes id from note', () => {
      const note = "My question::My answer^308081"
      const cards = parseInline({ note, file })
      const card = cards[0]
      expect(card).not.toBeNull()
      expect(card!.question).toEqual('My question')
      expect(card!.answer).toEqual('My answer')
      expect(card!.id).toEqual('308081')
    })
  })

  describe('when note has card id with whitespaces', () => {
    it('parses inline card and assignes id from note without whitespaces', () => {
      const note = "My question::My answer ^308081 "
      const cards = parseInline({ note, file })
      const card = cards[0]
      expect(card).not.toBeNull()
      expect(card!.question).toEqual('My question')
      expect(card!.answer).toEqual('My answer')
      expect(card!.id).toEqual('308081')
    })
  })

  describe('when note has block references', () => {
    it('parses inline card and ignores block references?', () => {
      const note = `
      Test #test

Question::Answer

Some text

[[Link 1#^308081]]
[[Link 2#^9c18f4]]

Another text
`;
      const cards = parseInline({ note, file });
      const card = cards[0];
      expect(cards.length).toEqual(1);
      expect(card).not.toBeNull()
      expect(card!.question).toEqual('Question')
      expect(card!.answer).toEqual('Answer')
      expect(card!.id).toBeNull()
    })
  })
})
