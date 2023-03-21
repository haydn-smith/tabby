import Section from './section';
import Serialisable from './serialisable';

export default class Tab implements Serialisable {
  public name: string;

  public readOnly = false;

  public sections: Array<Section> = [];

  public constructor() {
    this.name = 'New Tab';
  }

  public static make(): Tab {
    return new Tab().addSection();
  }

  public static makeFromTab(tab: Tab): Tab {
    const newTab = new Tab();

    newTab.name = tab.name;
    newTab.sections = tab.sections.map((section) => Section.makeFromSection(section));

    return newTab;
  }

  public getSection(index: number): Section {
    if (this.sections[index] === undefined) {
      throw new Error('Section does not exist!');
    }

    return this.sections[index];
  }

  public addSection(): Tab {
    const tab = Tab.makeFromTab(this);

    tab.sections.push(Section.make());

    return tab;
  }

  public setSection(section: Section, sectionIndex: number): Tab {
    const tab = Tab.makeFromTab(this);

    tab.sections = tab.sections.map((oldSection, index) => {
      return index === sectionIndex ? section : oldSection;
    });

    return tab;
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

  public static fromJson(json: Record<string, unknown>): Tab {
    const tab = new Tab();

    if (typeof json.name === 'string' && Array.isArray(json.sections)) {
      tab.name = json.name;
      json.sections.forEach((section) => tab.sections.push(Section.fromJson(section)));
    }

    return tab;
  }
}
