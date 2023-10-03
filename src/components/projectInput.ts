import { projectState } from '../state'
import type { Validatable } from '../../types'

const template = document.createElement('template')
template.setAttribute('id', 'project-input')
template.innerHTML = `
  <style>
    label,
    input,
    textarea {
      display: block;
      margin: 0.5rem 0;
    }
    
    label {
      font-weight: bold;
    }
    
    input,
    textarea {
      font: inherit;
      padding: 0.2rem 0.4rem;
      width: 100%;
      max-width: 30rem;
      border: 1px solid #ccc;
    }
    
    input:focus,
    textarea:focus {
      outline: none;
      background: #fff5f9;
    }
    
    button {
      font: inherit;
      background: #ff0062;
      border: 1px solid #ff0062;
      cursor: pointer;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
    }
    
    button:focus {
      outline: none;
    }
    
    button:hover,
    button:active {
      background: #a80041;
      border-color: #a80041;
    }

    #user-id {
      margin: 1rem;
      padding: 1rem;
      border: 1px solid #ff0062;
      background: #f7f7f7;
    }
  </style>
  <form id="user-id">
    <div class="form-control">
      <label for="title">
        <slot name='label-title'>Title</slot>
      </label>
      <input type="text" id="title" />
    </div>
    <div class="form-control">
      <label for="description">
        <slot name='label-description'>Description</slot>
      </label>
      <textarea id="description" rows="3"></textarea>
    </div>
    <div class="form-control">
      <label for="people">
        <slot name='label-people'>People</slot>
      </label>
      <input type="number" id="people" step="1" min="0" max="10" />
    </div>
    <button type="submit">ADD PROJECT</button>
  </form>`

//  Autobind decorator
function autobind(_targed: unknown, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }
  return adjustedDescriptor
}

// Validation
function validate(input: Validatable) {
  const { value, required, minLength, maxLength, min, max } = input
  let isValid = true
  if (required) {
    isValid = isValid && value.toString().trim().length !== 0
  }
  if (minLength != null && typeof value === 'string') {
    isValid = isValid && value.length >= minLength
  }
  if (maxLength != null && typeof value === 'string') {
    isValid = isValid && value.length <= maxLength
  }
  if (min != null && typeof value === 'number') {
    isValid = isValid && value >= min
  }
  if (max != null && typeof value === 'number') {
    isValid = isValid && value <= max
  }
  return isValid
}

//ProjectInpur Class
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
    this.descriptionInputElement = shadow.querySelector('#description')! as HTMLInputElement
    this.peopleInputElement = shadow.querySelector('#people')! as HTMLInputElement
  }

  connectedCallback() {
    this.formElement.addEventListener('submit', this.submitHandler)
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      projectState.addProject(title, description, people)
      this.clearInputs()
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input please try again')
      return
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }
}
