import { projectState } from '../state'
import { ProjectStatus, type ListType, type Project } from '../../types'

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

      #finished-projects {
        border-color: #0044ff;
      }
      
      #finished-projects header {
        background: #0044ff;
      }
    </style>
    <section class="projects">
        <header>
            <h2></h2>
        </header>
        <ul></ul>
    </section>
`

export class ProjectList extends HTMLElement {
  element: HTMLElement
  assignedProjects: Project[]

  constructor(private type: ListType) {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
    this.element = shadow.querySelector('section')! as HTMLElement
    this.element.id = `${this.type}-projects`
    this.assignedProjects = []

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
    this.element.querySelector('ul')!.id = listId
    this.element.querySelector('h2')!.textContent = this.type + ' Projects'
  }

  private renderProjects() {
    const listEl = this.element.querySelector(`#${this.type}-projects-list`)! as HTMLUListElement
    listEl.innerHTML = ''
    for (const project of this.assignedProjects) {
      const listItem = document.createElement('li')
      listItem.textContent = project.title
      listEl.appendChild(listItem)
    }
  }
}
