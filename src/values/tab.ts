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

    public addSection() {
        this.sections.push(new Section());
    }
}
