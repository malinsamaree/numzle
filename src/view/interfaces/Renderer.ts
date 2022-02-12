export interface Renderable {
  parentElement:Element | null;
  markup: string;
}

export class Renderer {
  constructor(public element:Renderable) {
    this.render();
  }

  render = () => {
    this.element.parentElement && this.element.parentElement.insertAdjacentHTML('beforeend', this.element.markup)
  } 

}