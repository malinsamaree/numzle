// import { bordSizes } from "./utils/variables";
// import { arrayShuffle } from "./utils/functions";

export class BoardModel {

  width:number = 3;
  height: number = 3;
  tiles: number[] = [];
  dragableTiles: number[] = [];
  tilesInSequence: number[] = [];
  isWon: boolean = false;
  moves: number = 0;
  initTimestamp: Date | null = null;
  duration: number = 0;

  //height and width must be 3 or more
  bordSizes = [
    [3,3], [4,4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10],
    [3,4], [4,3], [4,5], [5,4], [5,6], [6,5], [6,7], [7,6],
    [7,8], [8,7], [8,9], [9,8], [9,10], [10,9]
  ];

  constructor() {
      this.initBoard(3,3);
    }
  
  initBoard = (
    width: number,
    height: number) => {
      this.width = width;
      this.height = height;
    if(this.isSizeValid()){
      this.arrayShuffle();
      this.setDragableTiles();
    }
  }

  setDuration = (seconds: number) => {
    this.duration = seconds;
  }

  isSizeValid = (): boolean => {
    let isValid = false;
    this.bordSizes.forEach((size) => {
      if((this.width === size[0]) && (this.height === size[1])) {
        isValid = true;
      }
    });
    return isValid;
  }

  arrayShuffle = ()  => {
    const length = this.width * this.height;
    this.tiles = [...Array(length).keys()]

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.round(Math.random() * (length-1));
      if(randomIndex !== i) {
        const curValue = this.tiles[i];
        this.tiles[i] = this.tiles[randomIndex];
        this.tiles[randomIndex] = curValue;
      }
    }
  }


  gameState = (): boolean => {
    if(this.isWon) return true;
    let won = true;
    this.tilesInSequence = [];
    for (let i = 0; i < this.tiles.length-1; i++) {
      if(this.tiles[i] === i+1) {
        this.tilesInSequence.push(this.tiles[i]);
      } else {
        won = false;
        break;
      }
    }
    return won;
  }

  drag = (tile: number) => {
    const index = this.tiles.indexOf(tile)
    if(this.isWon) return;
    if(!this.dragableTiles.includes(index)) return;
    const indexOfZero = this.tiles.indexOf(0);
    this.tiles[indexOfZero] = this.tiles[index];
    this.tiles[index] = 0;
    this.setDragableTiles();
    this.isWon = this.gameState();
    this.moves++;

    if(!this.initTimestamp) {
      this.initTimestamp = new Date();
    }
  }

  setDragableTiles = (): void => {
    const indexOfZero = this.tiles.indexOf(0);
    const dragableArray = []

    const sideLeft = [];
    const sideRight = [];
    for (let i = 0; i < this.height-2; i++) {
      sideLeft.push((i+1)*this.width);
      sideRight.push(((i+2)*this.width)-1)
    }

    if (indexOfZero === 0) {
      dragableArray.push(1);
      dragableArray.push(this.width)
    } else if (indexOfZero === this.width-1) {
      dragableArray.push(this.width-2);
      dragableArray.push((this.width*2)-1)
    } else if (indexOfZero === this.width * (this.height-1)) {
      dragableArray.push((this.width) * (this.height-2));
      dragableArray.push(((this.width) * (this.height-1))+1)
    } else if (indexOfZero === (this.width*this.height)-1) {
      dragableArray.push((this.width*(this.height-1))-1)
      dragableArray.push((this.width*this.height)-2);
    } else if(indexOfZero > 0 && indexOfZero < (this.width -1)) {
      dragableArray.push(indexOfZero-1);
      dragableArray.push(indexOfZero+1);
      dragableArray.push(indexOfZero+this.width)
    } else if (indexOfZero > (this.width * (this.height-1)) && indexOfZero < (this.width*this.height)-1) {
      dragableArray.push(indexOfZero-1);
      dragableArray.push(indexOfZero+1);
      dragableArray.push(indexOfZero-this.width);
    } else if (sideLeft.includes(indexOfZero)) {
      dragableArray.push(indexOfZero-this.width);
      dragableArray.push(indexOfZero+this.width);
      dragableArray.push(indexOfZero+1);
    } else if (sideRight.includes(indexOfZero)) {
      dragableArray.push(indexOfZero-this.width);
      dragableArray.push(indexOfZero+this.width);
      dragableArray.push(indexOfZero-1);
    } else {
      dragableArray.push(indexOfZero-this.width);
      dragableArray.push(indexOfZero+this.width);
      dragableArray.push(indexOfZero-1);
      dragableArray.push(indexOfZero+1);
    }

    this.dragableTiles = dragableArray;
  }

  setSize = (width: number, height: number): void => {
    this.width = width;
    this.height = height;
  }

  getSize = (): number[] => {
    return [this.width, this.height];
  }

  getBoard = () => {
    return {
      width: this.width,
      height: this.height,
      tiles: this.tiles,
      tilesInSequesnce: this.tilesInSequence,
      dragableTiles: this.dragableTiles,
      isWon: this.isWon,
      moves: this.moves,
      initTimestamp: this.initTimestamp
    }
  }
  

}