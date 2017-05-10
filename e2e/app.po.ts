import { browser, by, element } from 'protractor'

export class ArpPage {
  navigateTo() {
    return browser.get('/')
  }

  getParagraphText() {
    return element(by.css('arp-app h1')).getText()
  }
}