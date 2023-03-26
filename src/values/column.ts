import { v1 } from 'uuid';
import Note from './note';
import Position from './position';
import Serialisable from './serialisable';

export default class Column implements Serialisable {
  public constructor(
    public readonly id = v1(),
    public readonly positions: Array<Position> = [],
    public readonly tuning: Note[]
  ) {}

  public static create(tuning: Note[]): Column {
    return new Column(
      v1(),
      tuning.map((_, index) => new Position(index + 1, '')),
      tuning
    );
  }

  public static createFromJson(json: Record<string, unknown>, tuning: Note[]): Column {
    if (Array.isArray(json.positions)) {
      return new Column(
        v1(),
        json.positions.map((position) => Position.createFromJson(position)),
        tuning
      );
    }

    throw new Error('Cannot create tab column from json!');
  }

  public getStrings(): number[] {
    return this.tuning.map((_, i) => i + 1);
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

  public setTuning(tuning: Note[]): Column {
    return new Column(
      this.id,
      tuning.map((_, index) =>
        this.positions.at(index) ? (this.positions.at(index) as Position) : new Position(index + 1, '')
      ),
      tuning
    );
  }

  public setNote(string: number, fret: string): Column {
    return new Column(
      this.id,
      this.positions.map((position) => (position.string === string ? new Position(string, fret) : position)),
      this.tuning
    );
  }

  public toJson(): Record<string, unknown> {
    return {
      positions: this.positions.map((note) => note.toJson()),
    };
  }
}
