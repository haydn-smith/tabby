import Semitone from '../enum/semitone';
import Note from './note';
import Section from './section';
import Serialisable from './serialisable';

export default class Tab implements Serialisable {
  public constructor(
    public readonly name = 'New Tab',
    public readonly sections: Array<Section> = [],
    public readonly tuning: Note[]
  ) {}

  public static create(): Tab {
    return new Tab(
      'New Tab',
      [],
      [
        new Note(Semitone.E, 4),
        new Note(Semitone.B, 3),
        new Note(Semitone.G, 3),
        new Note(Semitone.D, 3),
        new Note(Semitone.A, 2),
        new Note(Semitone.E, 2),
      ]
    ).addSection();
  }

  public static createFromJson(json: Record<string, unknown>): Tab {
    if (typeof json.name === 'string' && Array.isArray(json.sections) && Array.isArray(json.tuning)) {
      return new Tab(
        json.name,
        json.sections.map((section) => Section.createFromJson(section)),
        json.tuning.map((note) => Note.createFromJson(note))
      );
    }

    throw new Error('Cannot create tab from json!');
  }

  public isNew(): boolean {
    return this.sections.length <= 1 && !this.sections.at(0)?.isPopulated();
  }

  public setTuning(tuning: Note[]): Tab {
    return new Tab(
      this.name,
      this.sections.map((section) => section.setTuning(tuning)),
      tuning
    );
  }

  public getSection(index: number): Section {
    if (this.sections[index] === undefined) {
      throw new Error('Section does not exist!');
    }

    return this.sections[index];
  }

  public addSection(): Tab {
    return new Tab(this.name, [...this.sections, Section.create(this.tuning)], this.tuning);
  }

  public deleteSection(index: number): Tab {
    return new Tab(
      this.name,
      this.sections.filter((_, i) => i !== index),
      this.tuning
    );
  }

  public setSection(section: Section, sectionIndex: number): Tab {
    return new Tab(
      this.name,
      this.sections.map((oldSection, index) => {
        return index === sectionIndex ? section : oldSection;
      }),
      this.tuning
    );
  }

  public toJson(): Record<string, unknown> {
    return {
      name: this.name,
      sections: this.sections.map((section) => section.toJson()),
      tuning: this.tuning.map((note) => note.toJson()),
    };
  }

  public toText(): string {
    return `Tab Name: ${this.name}

${this.sections.reduce((acc, section) => acc.concat(section.toText()), '')}`;
  }
}
