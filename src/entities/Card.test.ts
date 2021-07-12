import parseInline from "./Card";

describe('inline parser', () => {
  it('parses inline card', () => {
    const line = "My question::My answer"
    const card = parseInline(line)
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
  })

  it('parses inline card with whitespace left to separator', () => {
    const line = "My question ::My answer"
    const card = parseInline(line)
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
  })

  it('parses inline card with whitespace right to separator', () => {
    const line = "My question:: My answer"
    const card = parseInline(line)
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
  })

  it('parses inline card with whitespace around separator', () => {
    const line = "My question :: My answer"
    const card = parseInline(line)
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
  })

  it.skip('parses inline card in a list', () => {
    const line = "- My question :: My answer"
    const card = parseInline(line)
    expect(card).not.toBeNull()
    expect(card!.question).toEqual('My question')
    expect(card!.answer).toEqual('My answer')
  })
})
