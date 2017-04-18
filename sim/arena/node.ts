import { Agent } from '../agent/agent'
import { Edge }  from './edge'

export class Node {

 edges: Edge[] = []
 agents: Agent[] = []

 constructor(
   public id: number,
   public x: number,
   public y: number,
 ) {}

 link(node: Node): Edge {
   const edge = new Edge(this, node)
   this.edges.push(edge)
   node.edges.push(edge)
   return edge
 }

 enter(agent: Agent): void {
   this.agents.push(agent)
   agent.location = this
 }

 leave(agent: Agent): void {
   const idx = this.agents.indexOf(agent)
   this.agents.splice(idx, 1)
 }

}
