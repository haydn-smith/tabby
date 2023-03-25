import Section from './section';
import Serialisable from './serialisable';

export default class Tab implements Serialisable {
  public constructor(public readonly name = 'New Tab', public readonly sections: Array<Section> = []) {}

  public static create(): Tab {
    return new Tab().addSection();
  }

  public static createFromJson(json: Record<string, unknown>): Tab {
    if (typeof json.name === 'string' && Array.isArray(json.sections)) {
      return new Tab(
        json.name,
        json.sections.map((section) => Section.createFromJson(section))
      );
    }

    throw new Error('Cannot create tab from json!');
  }

  public getSection(index: number): Section {
    if (this.sections[index] === undefined) {
      throw new Error('Section does not exist!');
    }

    return this.sections[index];
  }

  public addSection(): Tab {
    return new Tab(this.name, [...this.sections, Section.create()]);
  }

  public deleteSection(index: number): Tab {
    return new Tab(
      this.name,
      this.sections.filter((_, i) => i !== index)
    );
  }

  public setSection(section: Section, sectionIndex: number): Tab {
    return new Tab(
      this.name,
      this.sections.map((oldSection, index) => {
        return index === sectionIndex ? section : oldSection;
      })
    );
  }

  public toJson(): Record<string, unknown> {
    return {
      name: this.name,
      sections: this.sections.map((section) => section.toJson()),
    };
  }

  public toText(): string {
    return 'Work in progress, sorry!';
  }
}
