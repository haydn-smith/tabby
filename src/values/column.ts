import { v1 } from 'uuid';
import Position from './position';
import Serialisable from './serialisable';

export default class Column implements Serialisable {
  public constructor(public readonly id = v1(), public readonly positions: Array<Position> = []) {}

  public static create(): Column {
    return new Column(
      v1(),
      [1, 2, 3, 4, 5, 6].map((string) => new Position(string, ''))
    );
  }

  public static createFromJson(json: Record<string, unknown>): Column {
    if (Array.isArray(json.positions)) {
      return new Column(
        v1(),
        json.positions.map((position) => Position.createFromJson(position))
      );
    }

    throw new Error('Cannot create tab column from json!');
  }

  public getStringPosition(string: number): Position {
    const position = this.positions.filter((position) => position.string === string)[0];

    if (position === undefined) {
      throw new Error('No position found on string!');
    }

    return position;
  }

  public getCharacterWidth(): number {
    return this.positions.reduce((acc, note) => {
      return Math.max(acc, note.fret.length);
    }, 1);
  }

  public getStrings(): Array<number> {
    return [1, 2, 3, 4, 5, 6];
  }

  public setNote(string: number, fret: string): Column {
    return new Column(
      this.id,
      this.positions.map((position) => (position.string === string ? new Position(string, fret) : position))
    );
  }

  public toJson(): Record<string, unknown> {
    return {
      notes: this.positions.map((note) => note.toJson()),
    };
  }
}
