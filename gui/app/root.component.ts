import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy,
  OnInit, ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatAccordion } from '@angular/material'

import { Subscription } from 'rxjs'

import * as cytoscape from 'cytoscape'

import { defaultConfig } from '@arp/shared'

import { SimulatorService } from './shared/services/simulator.service'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: [
    '../styles/form-block.scss',
    './root.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly simulatorService: SimulatorService,
  ) {}

  private cy?: cytoscape.Core
  private eventSub?: Subscription

  @ViewChild(MatAccordion) readonly accordion!: MatAccordion
  @ViewChild('graph') readonly graphContainer!: ElementRef

  allOpen = true

  form = this.formBuilder.group({
    agents: this.formBuilder.group({
      police: [200, Validators.required],
      civilians: [800, Validators.required],
      offenders: [200, Validators.required],
    }),
  })

  ngOnInit(): void {
    this.eventSub = this.simulatorService.events$.subscribe(evt => {
      switch (evt.type) {
        case 'ready':
          const elements: cytoscape.ElementDefinition[] = []

          elements.push(...evt.arena.nodes.map(node => ({
            group: 'nodes',
            data: { id: node.id.toString() },
          } as cytoscape.ElementDefinition)))

          elements.push(...evt.arena.edges.map(edge => ({
            group: 'edges',
            data: {
              source: edge.left.toString(),
              target: edge.right.toString(),
            },
          } as cytoscape.ElementDefinition)))

          this.cy = cytoscape({
            container: this.graphContainer.nativeElement,
            layout: {
              name: 'grid',
              rows: evt.arena.height,
              cols: evt.arena.width,
            },
            elements: elements,
            style: [
              { selector: 'node', style: { content: 'data(id)' } } as cytoscape.Stylesheet,
            ],
          })
          this.cy.autolock(true)
          break

        case 'progress':
          break

        default:
          throw new Error('unexpected event type')
      }
    })
  }

  ngAfterViewInit(): void {
    // Need to do this in the next turn of the change detector
    Promise.resolve().then(() => this.accordion.openAll())

    console.log('GRAPH:', this.graphContainer)
  }

  ngOnDestroy(): void {
    if (this.eventSub) {
      this.eventSub.unsubscribe()
      delete this.eventSub
    }

    if (this.cy) {
      this.cy.destroy()
      delete this.cy
    }
  }

  toggleOpen(): void {
    if (this.allOpen) {
      this.accordion.closeAll()
    } else {
      this.accordion.openAll()
    }
    this.allOpen = !this.allOpen
  }

  start(): void {
    const config = defaultConfig()

    this.simulatorService.start()
    this.simulatorService.run(config)
  }

}
