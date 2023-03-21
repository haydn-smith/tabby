import { range } from 'ramda';
import Serialisable from './serialisable';

export default class Note implements Serialisable {
  public constructor(public string: number, public fret: string) {}

  public paddedFret(width: number): string {
    return range(0, width).reduce((acc, current) => {
      return acc.charAt(current) ? acc : acc + '-';
    }, this.fret);
  }

  public toJson(): Record<string, unknown> {
    return {
      string: this.string,
      fret: this.fret,
    };
  }

  public static fromJson(json: Record<string, unknown>): Note {
    if (typeof json.string === 'number' && typeof json.fret === 'string') {
      return new Note(json.string, json.fret);
    }

    throw new Error('Invalid Note() object encountered when converting from JSON!');
  }
}
