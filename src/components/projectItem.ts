import { autobind } from './projectInput'
import { ComponentDOM } from './component'
import { Draggable, Project } from '../../types'

const template = document.createElement('template')
template.innerHTML = `
<li id='single-project' draggable='true'>
    <h2></h2>
    <h3></h3>
    <p></p>
</li>
`

export class ProjectItem extends ComponentDOM<HTMLLIElement> implements Draggable {
  private project: Project

  get persons() {
    if (this.project.people === 1) {
      return '1 person'
    }
    return `${this.project.people} persons`
  }

  constructor(project: Project) {
    super(template, project.id)
    this.project = project
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
    this.element.querySelector('p')!.textContent = this.project.description
    this.configure()
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragEndHandler(_event: DragEvent): void {
    console.log('drag end')
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
  }
  renderContent() {}
}
