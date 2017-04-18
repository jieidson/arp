import { ArpPage } from './app.po'

describe('arp App', () => {
  let page: ArpPage

  beforeEach(() => {
    page = new ArpPage()
  })

  it('should display message saying app works', () => {
    page.navigateTo()
    expect(page.getParagraphText()).toEqual('arp works!')
  })
})
