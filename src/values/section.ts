import Semitone from '../enum/semitone';
import Column from './column';
import Note from './note';
import Serialisable from './serialisable';

export default class Section implements Serialisable {
  public name: string;

  public columns: Array<Column> = [];

  public constructor() {
    this.name = 'New Tab Section';
  }

  public static make(): Section {
    const section = new Section();

    section.columns.push(Column.make());

    return section;
  }

  public static makeFromSection(section: Section): Section {
    const newSection = new Section();

    newSection.name = section.name;
    newSection.columns = section.columns.map((column) => Column.makeFromColumn(column));

    return newSection;
  }

  public addColumn(columnIndex: number): Section {
    const section = Section.makeFromSection(this);

    section.columns.splice(columnIndex, 0, Column.make());

    return section;
  }

  public deleteColumn(columnIndex: number): Section {
    const section = Section.makeFromSection(this);

    section.columns.splice(columnIndex, 1);

    return section;
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
    const section = Section.makeFromSection(this);

    section.columns = section.columns.map((oldColumn, index) => {
      return index === columnIndex ? column : oldColumn;
    });

    return section;
  }

  public updateName(name: string): Section {
    const section = Section.makeFromSection(this);

    section.name = name;

    return section;
  }

  public rootNoteForString(string: number): Note {
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

  public static fromJson(json: Record<string, unknown>): Section {
    const section = new Section();

    if (typeof json.name === 'string' && Array.isArray(json.columns)) {
      section.name = json.name;
      json.columns.forEach((column) => section.columns.push(Column.fromJson(column)));
    }

    return section;
  }
}
