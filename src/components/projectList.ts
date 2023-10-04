import { Component } from './component'
import { projectState } from '../state'
import { ProjectStatus, type ListType, type Project, DragTarget } from '../../types'
import { ProjectItem } from './projectItem'
import { autobind } from './projectInput'

const template = document.createElement('template')
template.innerHTML = `
    <style>
      .projects {
        margin: 1rem;
        border: 1px solid #ff0062;
      }
      
      .projects header {
        background: #ff0062;
        height: 3.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .projects h2 {
        margin: 0;
        color: white;
        text-transform: capitalize;
      }
      
      .projects ul {
        list-style: none;
        margin: 0;
        padding: 1rem;
      }
      
      .projects li {
        box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
        padding: 1rem;
        margin: 1rem;
        background: white;
      }
      
      .projects li h2 {
        color: #ff0062;
        margin: 0.5rem 0;
      }
      
      #finished-projects li h2 {
        color: #0044ff;
      }
      
      .projects li h3 {
        color: #575757;
        font-size: 1rem;
      }
      
      .project li p {
        margin: 0;
      }

      .droppable {
        background: #ffe3ee;
      }

      #finished-projects {
        border-color: #0044ff;
      }
      
      #finished-projects header {
        background: #0044ff;
      }

      #finished-projects .droppable {
        background: #d6e1ff;
      }
    </style>
    <section class="projects" id='projects'>
        <header>
            <h2></h2>
        </header>
        <ul></ul>
    </section>
`

export class ProjectList extends Component<HTMLElement> implements DragTarget {
  ulElement: HTMLUListElement
  assignedProjects: Project[]

  static get observedAttributes() {
    return ['']
  }

  constructor(private type: ListType) {
    super(template, 'projects', `${type}-projects`)
    this.assignedProjects = []
    this.ulElement = this.element.querySelector('ul')! as HTMLUListElement

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active
        }
        return project.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
  }

  connectedCallback() {
    const listId = `${this.type}-projects-list`
    this.ulElement.id = listId
    this.element.querySelector('h2')!.textContent = this.type + ' Projects'
    this.ulElement.addEventListener('dragover', this.dragOverHandler)
    this.ulElement.addEventListener('dragleave', this.dragLeaveHandler)
    this.ulElement.addEventListener('drop', this.dropHandler)
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault()
      this.ulElement.classList.add('droppable')
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain')
    projectState.moveProject(
      projectId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished,
    )
  }

  @autobind
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragLeaveHandler(_event: DragEvent): void {
    this.ulElement.classList.remove('droppable')
  }

  private renderProjects() {
    const listEl = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement
    listEl.innerHTML = ''
    for (const project of this.assignedProjects) {
      const liElement = new ProjectItem(project).element
      listEl.appendChild(liElement)
    }
  }
}
