import {
  ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy,
  SimpleChanges,
} from '@angular/core'

import { ArenaData } from '@arp/shared'

import * as cytoscape from 'cytoscape'

@Component({
  selector: 'app-graph',
  template: '',
  styleUrls: ['./graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements OnChanges, OnDestroy {

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

  private cy?: cytoscape.Core

  @Input()
  data?: ArenaData = {
    width: 0,
    height: 0,
    nodes: [],
    edges: [],
  }

  ngOnDestroy(): void {
    if (this.cy) {
      this.destroy()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (this.data && this.data.width > 0 && this.data.height > 0
          && this.data.nodes.length > 0 && this.data.edges.length > 0) {
        this.update()
      } else {
        this.destroy()
      }
    }
  }

  private init(): void {
    this.cy = cytoscape({
      container: this.elementRef.nativeElement,
      minZoom: 0.5,
      maxZoom: 4,
      style: [
        {
          selector: 'node',
          style: {
            content: 'data(id)',
            'text-valign': 'center',
          },
        } as cytoscape.Stylesheet,
        {
          selector: 'edge',
          style: {
            content: 'data(weight)',
          },
        } as cytoscape.Stylesheet,
      ],
    })
  }

  private destroy(): void {
    if (this.cy) {
      this.cy.destroy()
      delete this.cy
    }
  }

  private update(): void {
    if (!this.cy) {
      this.init()
    }
    const cy = this.cy
    const data = this.data

    if (!cy) { return }
    if (!data) { return }

    cy.batch(() => {
      const nodes = data.nodes.map(node => ({
        group: 'nodes',
        data: { id: node.id.toString() },
      } as cytoscape.ElementDefinition))

      const edges = data.edges.map(edge => ({
        group: 'edges',
        data: {
          source: edge.left.toString(),
          target: edge.right.toString(),
          weight: edge.weight,
        },
      } as cytoscape.ElementDefinition))

      cy.remove('*')
      cy.add(nodes)
      cy.add(edges)

      cy.autolock(false)
      cy
        .layout({
          name: 'grid',
          rows: data.height,
          cols: data.width,
          fit: false,
          avoidOverlapPadding: 50,
        })
        .run()
      cy.autolock(true)
    })
  }

}
