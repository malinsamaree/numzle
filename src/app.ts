import 'regenerator-runtime/runtime'
import { BoardModel } from "./model/BoardModel";
import { HeaderView } from "./view/HeaderView/HeaderView";
import { GameView } from "./view/GameView/GameView";
import { BoardView } from "./view/BoardView/BoardView";
import { StatView } from "./view/StatView/StatView";
import { FooterView } from "./view/FooterView/FooterView";

document.addEventListener('DOMContentLoaded', (event) => {

  let board: BoardModel;
  const headerView:HeaderView =  new HeaderView(); 
  headerView.render();
  headerView.showBoardSelectorHandler();
  headerView.showThemeSelectorHandler();
  headerView.newBoardHandler(onNewBoard);
  headerView.newThemeHandler(onNewTheme); 
  const gameView = new GameView();
  gameView.render();
  const footerView = new FooterView();
  footerView.render();

  const init = async () => {  
    renderBoard();
    renderStatView();
  }

  const renderBoard = () => {
      const boardView = new BoardView(board);
      boardView.render();
      boardView.onClickHandler(onTileClick);
  }

  const renderStatView = () => {
    const statView = new StatView();
    statView.render();
    if(board.moves === 1) {
      statView.clock(onClockTick)
    }
  }

  const newGame = (width: number, height: number) => {
    board = new BoardModel();
    board.initBoard(width, height);
    init();
  }

  function onClockTick(seconds: number) {
    board.setDuration(seconds);
  }

  function onTileClick (tile: number) {
    board.drag(tile);
    renderBoard();
    if(board.moves === 1) {
      renderStatView();
      renderBoard();
    }
  }

  function onNewBoard (width: number, height: number) {
    newGame(width, height)
  }

  function onNewTheme(theme: string) {
    const classList = document.querySelector('#root')?.classList;

    if(classList) {
      for (let i = classList.length - 1; i >= 0; i--) {
        const className = classList[i];
        if (className.startsWith('theme')) {
            classList.remove(className);
        }
      }
    }

    classList?.add(theme);
  }

  window.addEventListener('resize', () => {
    renderBoard();
  });

  newGame(3,3);
})
