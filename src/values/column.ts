import { v1 } from 'uuid';
import Position from './position';
import Serialisable from './serialisable';

export default class Column implements Serialisable {
  public id = '';

  public notes: Array<Position> = [];

  public static make(): Column {
    const column = new Column();

    column.id = v1();

    // TODO: Dynamic string amount.
    [1, 2, 3, 4, 5, 6].forEach((string) => {
      column.notes.push(new Position(string, ''));
    });

    return column;
  }

  public static makeFromColumn(column: Column): Column {
    const newColumn = new Column();

    newColumn.id = column.id;

    newColumn.notes = column.notes.map((note) => new Position(note.string, note.fret));

    return newColumn;
  }

  public getNoteForString(string: number): Note {
    // TODO: Throw error on undefined.
    return this.notes.filter((note) => note.string === string)[0];
  }

  public getCharacterWidth(): number {
    return this.notes.reduce((acc, note) => {
      return Math.max(acc, note.fret.length);
    }, 1);
  }

  public getStrings(): Array<number> {
    // TODO: This will change for ukuleles/7-strings/etc...
    return [1, 2, 3, 4, 5, 6];
  }

  public setNote(string: number, fret: string): Column {
    const column = Column.makeFromColumn(this);

    column.notes = column.notes.map((note) => {
      return note.string === string ? new Position(string, fret) : note;
    });

    return column;
  }

  public toJson(): Record<string, unknown> {
    return {
      notes: this.notes.map((note) => note.toJson()),
    };
  }

  public static fromJson(json: Record<string, unknown>): Column {
    const column = new Column();
    column.id = v1();

    if (Array.isArray(json.notes)) {
      json.notes.forEach((note) => column.notes.push(Position.fromJson(note)));
    }

    return column;
  }
}
