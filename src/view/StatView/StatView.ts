export class StatView {
  markup = () => {
    return `
      <div class="stat">
        <div class="stat-moves"><span class="stat-moves-number">0</span> </div>
        <div class="stat-clock">00:00:00</div>
      </div>
    `
  }

  render = () => {
    document.querySelector('.game-stat')?.innerHTML =  this.markup();
  }

  clock = (onClockTick) => {
    const statClock = document.querySelector('.stat-clock')
    let seconds = 0;
    const clockInterval = setInterval(() => {
      seconds++;
      const hours = Math.round(seconds / 3600);
      const remainingSeconds = seconds % 3600;
      const minutes = Math.round(remainingSeconds/60);
      const stillRemainingSeconds = remainingSeconds % 60

      const clockString = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + stillRemainingSeconds).slice(-2)}`;
    
      statClock?.innerHTML = clockString; 
      onClockTick(seconds)
    }, 1000);
  }
}