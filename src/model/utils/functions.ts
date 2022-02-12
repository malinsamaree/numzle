export const arrayShuffle = (array:number[]): number[]  => {
  const arrayLength = array.length;
  const newArray = array;
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.round(Math.random() * (arrayLength-1));
    if(randomIndex !== i) {
      const curValue = newArray[i];
      newArray[i] = newArray[randomIndex];
      newArray[randomIndex] = curValue;
    }
  }
  return newArray;
}