import { Renderable } from "../../interfaces/Renderer";

export class StatView implements Renderable  {

  parentElement = document.querySelector('.game-stat');

  constructor(
    public seconds:number,
    public moves:number
  ){}

  get markup() {
    return `
      <div class="stat">
        <div class="stat-moves"><span class="stat-moves-number">${this.moves}</span> </div>
        <div class="stat-clock">00:00:00</div>
      </div>
    `
  }

  render = () => {
    this.parentElement && (this.parentElement.innerHTML =  this.markup);
  }

  clock (onClockTick:(seconds: number)=>void) {
    const statClock = document.querySelector('.stat-clock') as HTMLElement;
    console.log(this.seconds)
      this.seconds++;
      const hours = Math.round(this.seconds / 3600);
      const remainingSeconds = this.seconds % 3600;
      const minutes = Math.round(remainingSeconds/60);
      const stillRemainingSeconds = remainingSeconds % 60
  
      const clockString = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + stillRemainingSeconds).slice(-2)}`;
    
      statClock && (statClock.innerHTML = clockString); 
      onClockTick(this.seconds);
  }
}