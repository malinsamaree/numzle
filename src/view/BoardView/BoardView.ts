import { BoardModel } from "../../model/BoardModel";

export class BoardView {

  board;
  boardStyle: string | null = null;
  timeInterval: number | null = null;

  constructor(private boardModel: BoardModel){
    this.board = boardModel.getBoard();
    this.getStyles();
  }

  getStyles = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight-200;
    const limitedDiamention = windowWidth < windowHeight? windowWidth : windowHeight;

    if (this.board.width === this.board.height) {
      this.boardStyle = `
        width: ${limitedDiamention}px;
        height: ${limitedDiamention}px;
        grid-template-columns: repeat(${this.board.width}, 1fr);
      `;
    } else {
      const tileWidth = Math.floor(windowWidth/this.board.width);
      const tileHeight = Math.floor(windowHeight/this.board.height);
      const tileLength = tileWidth < tileHeight ? tileWidth : tileHeight;
      this.boardStyle = `
      width: ${tileLength*this.board.width}px;
      height: ${tileLength*this.board.height}px;
      grid-template-columns: repeat(${this.board.width}, 1fr);
      `;
    }
  }

  markup = () => {
    if(!this.board.isWon) {
      return `
        <div class="board">
          <div class="board-inner" style="${this.boardStyle}">
            
            ${this.board.tiles.map((tile) => {
              const emptyTile = tile===0 ? true : false;
              const dragableTile = this.board.dragableTiles.includes(this.board.tiles.indexOf(tile));
              let stylingClasses = "tile";
              emptyTile && (stylingClasses += " empty-tile");
              dragableTile && (stylingClasses += " dragable-tile")
              
              return `<div class="${stylingClasses}" draggable=${false}>${tile === 0 ? '' : tile}</div>`
              
            }
            ).join('')}
          </div>
        </div>
      `
    } else {
      console.log('won');
      return `<div>won</div>`
    }
  }

  onClickHandler = (onClick: (title: number) => void) => {

    setTimeout(() => {

      const container = document.querySelector('.board-inner');
      const parentProps = container?.getBoundingClientRect();
      const emptyTileProps = document.querySelector('.empty-tile')?.getBoundingClientRect();
      const emptyTileTop = emptyTileProps.top - parentProps.top;
      const emptyTileLeft = emptyTileProps.left - parentProps.left;
      
      const dragableTiles = document.querySelectorAll('.dragable-tile');

      dragableTiles.forEach(tile => {

        ['mousedown', 'touchstart'].forEach(event => {

          tile.addEventListener(event, (e) => {
            const tile: EventTarget | null = e.target;
            const tileValue = tile?.innerHTML;
            // dragableTile
            const childProps = tile.getBoundingClientRect();
            const left = childProps.left - parentProps.left;
            const top = childProps.top - parentProps.top;
            const sideLength = childProps.height;
      
            const absoluteTile = document.createElement('div');
            absoluteTile.innerHTML = tileValue;
            absoluteTile.setAttribute('class', 'absolute-tile');
            absoluteTile.setAttribute('style', `
              width: ${sideLength}px;
              height: ${sideLength}px;
              top: ${top}px;
              left: ${left}px;
            `);
            container?.appendChild(absoluteTile);
            tile.style.background = 'transparent';
            tile.innerHTML='';

            let curLeft = parseFloat(absoluteTile.style.left);
            const stepMoveDistance = (sideLength+3)/10;
            const stepMoveHorizontal = (emptyTileLeft - curLeft) >= 0 ? stepMoveDistance : -stepMoveDistance;

            let curTop = parseFloat(absoluteTile.style.top);
            const stepMoveVertical = (emptyTileTop-curTop) >= 0 ? stepMoveDistance : -stepMoveDistance;
            
            const moveInterval = setInterval(() => {
              curLeft += stepMoveHorizontal;
              curTop += stepMoveVertical;
              if(stepMoveHorizontal >= 0 && curLeft < emptyTileLeft) {
                absoluteTile.style.left = curLeft + 'px';
              } else if(stepMoveHorizontal <= 0 && curLeft > emptyTileLeft) {
                absoluteTile.style.left = curLeft + 'px';
              } else if (stepMoveVertical >= 0 && curTop < emptyTileTop) {
                absoluteTile.style.top = curTop + 'px';
              } else if(stepMoveVertical <= 0 && curTop > emptyTileTop) {
                absoluteTile.style.top = curTop + 'px';
              } else {
                clearInterval(moveInterval);
                if(tile instanceof HTMLElement){
                  onClick(parseInt(tileValue));
                }  
              }
            }, 10);
            
          });

        });

      });

    },60)

  }

  render = () => {
    const parentElement = document.querySelector('.game-board');
    if(parentElement){
      parentElement.innerHTML = '';
    }
    parentElement?.insertAdjacentHTML('beforeend', this.markup());
    document.querySelector('.stat-moves-number')?.innerHTML = this.board.moves;
  }

}