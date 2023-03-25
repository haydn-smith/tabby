import Semitone from '../enum/semitone';
import Column from './column';
import Note from './note';
import Serialisable from './serialisable';

export default class Section implements Serialisable {
  public constructor(public readonly name = 'New Tab Section', public readonly columns: Array<Column> = []) {}

  public static create(): Section {
    return new Section('New Tab Section', [Column.create()]);
  }

  public static createFromJson(json: Record<string, unknown>): Section {
    if (typeof json.name === 'string' && Array.isArray(json.columns)) {
      return new Section(
        json.name,
        json.columns.map((column) => Column.createFromJson(column))
      );
    }

    throw new Error('Cannot create tab section from json!');
  }

  public addColumn(index: number): Section {
    return new Section(this.name, [
      ...this.columns.slice(0, index + 1),
      Column.create(),
      ...this.columns.slice(index + 1),
    ]);
  }

  public deleteColumn(index: number): Section {
    return new Section(
      this.name,
      this.columns.filter((_, i) => i !== index)
    );
  }

  public getTuning(): Array<Note> {
    return [
      new Note(Semitone.E, 4),
      new Note(Semitone.B, 3),
      new Note(Semitone.G, 3),
      new Note(Semitone.D, 3),
      new Note(Semitone.A, 2),
      new Note(Semitone.E, 2),
    ];
  }

  public setColumn(column: Column, columnIndex: number): Section {
    return new Section(
      this.name,
      this.columns.map((oldColumn, index) => {
        return index === columnIndex ? column : oldColumn;
      })
    );
  }

  public updateName(name: string): Section {
    return new Section(name, this.columns);
  }

  public getRootNoteForString(string: number): Note {
    const note = this.getTuning().at(string - 1);

    if (note !== undefined) {
      return note;
    }

    throw new Error('No string at position ' + string);
  }

  public toJson(): Record<string, unknown> {
    return {
      name: this.name,
      columns: this.columns.map((column) => column.toJson()),
    };
  }
}
