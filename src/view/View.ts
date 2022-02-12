export abstract class View {
  abstract markup(): string;

  render = (parentElement: Element | null) => {
    parentElement?.insertAdjacentHTML('beforeend', this.markup());
  }
}