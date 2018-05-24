import { ArpPage } from './app.po'

describe('arp App', () => {
  let page: ArpPage

  beforeEach(() => {
    page = new ArpPage()
  })

  it('should display welcome message', () => {
    page.navigateTo()
    expect(page.getParagraphText()).toEqual('arp works!')
  })
})
