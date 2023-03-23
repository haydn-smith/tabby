import { range } from 'ramda';
import Serialisable from './serialisable';

export default class Position implements Serialisable {
  public constructor(public string: number, public fret: string) {}

  public paddedFret(width: number): string {
    return range(0, width).reduce((acc, current) => {
      return acc.charAt(current) ? acc : acc + '-';
    }, this.fret);
  }

  public isPlayable(): boolean {
    return this.fret.replace(/\D/, '').length > 0;
  }

  public fretNumber(): number {
    if (this.isPlayable()) {
      return Math.floor(Number(this.fret.replace(/\D/, '')));
    }

    throw new Error('Not a playable fret value: ' + this.fret);
  }

  public toJson(): Record<string, unknown> {
    return {
      string: this.string,
      fret: this.fret,
    };
  }

  public static fromJson(json: Record<string, unknown>): Position {
    if (typeof json.string === 'number' && typeof json.fret === 'string') {
      return new Position(json.string, json.fret);
    }

    throw new Error('Invalid Note() object encountered when converting from JSON!');
  }
}
