export class GameView {
  markup = () => {
    return `
    <div class="game">
      <div class="game-board"></div>
      <div class="game-stat"></div>
    </div>
    `
  }

  render = () => {
    document.querySelector('#root')?.insertAdjacentHTML('beforeend', this.markup());
  }
} 