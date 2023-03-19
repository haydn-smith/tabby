import { range } from 'ramda';

export default class Note {
  public constructor(public string: number, public fret: string) {}

  public paddedFret(width: number): string {
    return range(0, width).reduce((acc, current) => {
      return acc.charAt(current) ? acc : acc + '-';
    }, this.fret);
  }
}
