import { Renderable } from "../../interfaces/Renderer";

export class HeaderView implements Renderable{

  parentElement = document.querySelector('#root');

  get markup(): string {
    return `
    <div class='header'>
    <div class="logo">numzle</div>
    
    <div class="board-selector-link">
      <a href="#">boards</a>
    </div>

    <div class="theme-selector-link">
      <a href="#">themes</a>
    </div>

    <div class="board-selector hide">
      <div class="board-selector-inner">
        <div class='board-selector-inner-close'>
          <a href="#">&#9587;</a>
        </div>
        <div class='board-selector-inner-boards'>
          <a href="#" data-type="board" data-width="3" data-height="3">3x3</a>
          <a href="#" data-type="board" data-width="4" data-height="4">4x4</a>
          <a href="#" data-type="board" data-width="5" data-height="5">5x5</a>
          <a href="#" data-type="board" data-width="6" data-height="6">6x6</a>
          <a href="#" data-type="board" data-width="7" data-height="7">7x7</a>
          <a href="#" data-type="board" data-width="8" data-height="8">8x8</a>
          <a href="#" data-type="board" data-width="9" data-height="9">9x9</a>
          <a href="#" data-type="board" data-width="10" data-height="10">10x10</a>
          <a href="#" data-type="board" data-width="3" data-height="4">3x4</a>
          <a href="#" data-type="board" data-width="4" data-height="3">4x3</a>
          <a href="#" data-type="board" data-width="4" data-height="5">4x5</a>
          <a href="#" data-type="board" data-width="5" data-height="4">5x4</a>
          <a href="#" data-type="board" data-width="5" data-height="6">5x6</a>
          <a href="#" data-type="board" data-width="6" data-height="5">6x5</a>
          <a href="#" data-type="board" data-width="6" data-height="7">6x7</a>
          <a href="#" data-type="board" data-width="7" data-height="6">7x6</a>
          <a href="#" data-type="board" data-width="7" data-height="8">7x8</a>
          <a href="#" data-type="board" data-width="8" data-height="9">8x9</a>
          <a href="#" data-type="board" data-width="9" data-height="8">9x8</a>
          <a href="#" data-type="board" data-width="9" data-height="10">9x10</a>
          <a href="#" data-type="board" data-width="10" data-height="9">10x9</a>
        </div>
      </div>
    </div>

    <div class="theme-selector hide">
       <div class="theme-selector-inner">
        <div class='theme-selector-inner-close'>
          <a href="#">&#9587;</a>
        </div>
        <div class='theme-selector-inner-themes'>
          <div class="theme theme-selector-inner-themes-seasons" data-type="theme" data-theme="theme-classic"></div>
          <div class="theme theme-selector-inner-themes-aqua" data-type="theme" data-theme="theme-aqua"></div>
          <div class="theme theme-selector-inner-themes-nature" data-type="theme" data-theme="theme-universe"></div>
        </div>
      </div>
    </div>

    </div>
    `
  }

  showBoardSelectorHandler = () => {
    document.querySelector('.board-selector-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.board-selector')?.classList.contains('hide') && 
      document.querySelector('.board-selector')?.classList.remove('hide');
    });

    document.querySelector('.board-selector-inner-close')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.hideBoardSelector();
    });

    document.querySelector('.board-selector')?.addEventListener('click', (e) => {
      e.preventDefault();
      (e.target === document.querySelector('.board-selector')) && this.hideBoardSelector(); 
    })

  }

  showThemeSelectorHandler = () => {
    document.querySelector('.theme-selector-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.theme-selector')?.classList.contains('hide') && 
      document.querySelector('.theme-selector')?.classList.remove('hide');
    });

    document.querySelector('.theme-selector-inner-close')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.hideThemeSelector();
    });

    document.querySelector('.theme-selector')?.addEventListener('click', (e) => {
      e.preventDefault();
      (e.target === document.querySelector('.theme-selector')) && this.hideThemeSelector(); 
    })

  }

  hideBoardSelector = () => {
      !document.querySelector('.board-selector')?.classList.contains('hide') && 
      document.querySelector('.board-selector')?.classList.add('hide');
  }

  hideThemeSelector = () => {
    !document.querySelector('.theme-selector')?.classList.contains('hide') && 
    document.querySelector('.theme-selector')?.classList.add('hide');
  }

  newBoardHandler = (onNewBoard: (a: number, b: number) => void) => {
    document.querySelector('.board-selector')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(e.target instanceof HTMLElement) {
        if(e.target?.dataset.type === 'board') {
          const width: number = parseInt (e.target.dataset.width ?? '3');
          const height: number = parseInt(e.target.dataset.height ?? '3');
          onNewBoard(width, height);
          this.hideBoardSelector();
        } 
      }
    });
  }

  newThemeHandler = (onNewTheme: (theme: string) => void) => {
    document.querySelector('.theme-selector')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(e.target instanceof HTMLElement) {
        if(e.target.dataset.type === 'theme') {
          e.target.dataset.theme && onNewTheme(e.target.dataset.theme);
          this.hideThemeSelector();
        }
      }
    })
  }

}