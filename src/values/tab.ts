import Arrangement from "./arrangement";
import Section from "./section";

export default class Tab {
    public name: string;

    public arrangement: Arrangement;

    public sections: Array<Section> = [];

    public constructor() {
        this.name = 'Tabby Tab!';

        this.arrangement = new Arrangement();
    }

    public static makeFromTab(tab: Tab): Tab {
        const newTab = new Tab();

        newTab.name = tab.name;
        newTab.sections = tab.sections.map(section => Section.makeFromSection(section));

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
}
