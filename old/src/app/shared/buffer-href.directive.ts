import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core'

@Directive({
  selector: '[arpBufferHref]',
})
export class BufferHrefDirective implements OnChanges, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('arpBufferHref') buffer: ArrayBuffer

  private element: HTMLAnchorElement
  private lastURL?: string

  constructor(element: ElementRef) {
    this.element = element.nativeElement
  }

  ngOnDestroy(): void {
    if (this.lastURL) {
      window.URL.revokeObjectURL(this.lastURL)
    }
  }

  ngOnChanges(): void {
    this.updateHref()
  }

  private updateHref(): void {
    console.log('UPDATE')
    if (this.lastURL) {
      window.URL.revokeObjectURL(this.lastURL)
    }

    if (!this.buffer) {
      this.element.href = ''
      return
    }

    const blob = new Blob([this.buffer], { type: 'application/octet-stream' })
    this.lastURL = window.URL.createObjectURL(blob)
    this.element.href = this.lastURL
  }

}
