import Column from './column';

export default class Section {
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
}
