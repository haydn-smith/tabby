import Column from './column';
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

  public addColumn(): Section {
    const section = Section.makeFromSection(this);

    section.columns.push(Column.make());

    return section;
  }

  public getTuning(): Array<string> {
    return ['e', 'B', 'G', 'D', 'A', 'E'];
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
