export default class Note {
  public constructor(public string: number, public fret: string) {}

  public paddedFret(width: number): string {
    let str = this.fret;

    while (str.length < width) {
      str += '-';
    }

    return str;
  }
}
