const template = document.createElement('template')
template.setAttribute('id', 'project-input')
template.innerHTML = `
    <form part="form" id="user-id">
          <div class="form-control">
            <label part="label" for="title">Title</label>
            <input part="input" type="text" id="title" />
          </div>
          <div class="form-control">
            <label part="label" for="description">Description</label>
            <textarea part="textarea" id="description" rows="3"></textarea>
          </div>
          <div class="form-control">
            <label part="label" for="people">People</label>
            <input part="input" type="number" id="people" step="1" min="0" max="10" />
          </div>
          <button part="button" type="submit">ADD PROJECT</button>
    </form>`

export class ProjectInput extends HTMLElement {
  formElement: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))

    this.formElement = shadow.querySelector('#user-id')! as HTMLFormElement
    this.titleInputElement = shadow.querySelector('#title')! as HTMLInputElement
    this.descriptionInputElement = shadow.querySelector(
      '#description',
    )! as HTMLInputElement
    this.peopleInputElement = shadow.querySelector(
      '#people',
    )! as HTMLInputElement

    this.configure()
  }

  private submitHandler(event: Event) {
    event.preventDefault()
    console.log(this.titleInputElement.value)
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this))
  }

  //   static get observableAttributes() {
  //     return ['value']
  //   }

  //   attributeChangeCallback(name: string, oldValue: string, newValue: string) {
  //     console.log(name, oldValue, newValue)
  //   }
}
