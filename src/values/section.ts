import Column from "./column";

export default class Section {
    public name: string;

    public columns: Array<Column> = [];

    public constructor() {
        this.name = 'New Tab Section';
    }
}
