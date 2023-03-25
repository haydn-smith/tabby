import { range } from 'ramda';
import Serialisable from './serialisable';

export default class Position implements Serialisable {
  public constructor(public readonly string: number, public readonly fret: string) {}

  public static createFromJson(json: Record<string, unknown>): Position {
    if (typeof json.string === 'number' && typeof json.fret === 'string') {
      return new Position(json.string, json.fret);
    }

    throw new Error('Cannot create tab position from json!');
  }

  public padFret(width: number): string {
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
}
