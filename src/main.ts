import { ProjectInput } from './components/projectInput'
import { ProjectList } from './components/projectList'

class ActiveProjectList extends ProjectList {
  constructor() {
    super('active')
  }
}

class FinishedProjectList extends ProjectList {
  constructor() {
    super('finished')
  }
}
window.customElements.define('project-input', ProjectInput)
window.customElements.define('active-project-list', ActiveProjectList)
window.customElements.define('finished-project-list', FinishedProjectList)
