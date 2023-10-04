export abstract class Component<T extends HTMLElement> extends HTMLElement {
  element: T
  shadow: ShadowRoot

  constructor(
    public templateElement: HTMLTemplateElement,
    elementId: string,
    newElementId?: string,
  ) {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.append(templateElement.content.cloneNode(true))
    this.element = this.shadow.querySelector(`#${elementId}`)! as T
    if (newElementId) {
      this.element.id = newElementId
    }
  }
}

export abstract class ComponentDOM<T extends HTMLElement> {
  element: T

  constructor(
    public templateElement: HTMLTemplateElement,
    newElementId?: string,
  ) {
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as T
    if (newElementId) {
      this.element.id = newElementId
    }
  }

  abstract configure(): void
  abstract renderContent(): void
}
