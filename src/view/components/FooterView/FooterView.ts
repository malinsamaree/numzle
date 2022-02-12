import { Renderable } from "../../interfaces/Renderer"

export class FooterView implements Renderable{

  parentElement = document.querySelector('#root');

  get markup(): string{
    return `
    <div class="footer">footer</div>
    `
  }
}