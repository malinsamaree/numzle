import 'regenerator-runtime/runtime';
import { Renderable, Renderer } from './view/interfaces/Renderer';
import { BoardModel } from "./model/BoardModel";
import { HeaderView } from "./view/components/HeaderView/HeaderView";
import { GameView } from "./view/components/GameView/GameView";
import { BoardView } from "./view/components/BoardView/BoardView";
import { StatView } from "./view/components/StatView/StatView";
import { FooterView } from "./view/components/FooterView/FooterView";

document.addEventListener('DOMContentLoaded', (event) => {

  let board: BoardModel;
  let clockInterval: ReturnType<typeof setInterval>;

  const headerView:HeaderView =  new HeaderView();
  new Renderer(headerView);
  headerView.showBoardSelectorHandler();
  headerView.showThemeSelectorHandler();
  headerView.newBoardHandler(onNewBoard);
  headerView.newThemeHandler(onNewTheme); 
  const gameView = new GameView();
  gameView.render();

  const footerView:Renderable = new FooterView();
  const footerRenderer = new Renderer(footerView);


  const init = async () => {
    renderBoard();
    renderStatView();
  }

  const renderBoard = () => {
      const boardView = new BoardView(board);
      boardView.render();
      !board.isWon && boardView.onClickHandler(onTileClick);
  }

  
  const renderStatView = () => {
    clearInterval(clockInterval);
    const statView = new StatView(board.duration, board.moves);
    statView.render();
    if(!board.isWon) {
      if(board.newGame && board.moves === 1) {
        statView.clock(onClockTick);  
        clockInterval = setInterval(() => {
          statView.clock(onClockTick);
        }, 1000);
      } else if (!board.newGame && board.moves > 0) {
        statView.clock(onClockTick);  
        clockInterval = setInterval(() => {
          statView.clock(onClockTick);
        }, 1000);
      }
    }
  }

  const newGame = (width?: number, height?: number) => {
    board = new BoardModel();
    width && height && board.initBoard(width, height);
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

  newGame();

});



