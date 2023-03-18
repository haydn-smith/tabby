import Modifier from "../enum/modifier";
import Note from "./note";

export default class Column {
    public notes: Array<Note> = [];

    public getNoteAtString(string: number): Note|undefined {
        return this.notes.filter((note) => note.string === string)[0];
    }

    public removeNoteAtString(string: number): void {
        this.notes = this.notes.filter(note => note.string !== string);
    }

    public getMaxCharacterWidth(): number {
        return this.notes.reduce((acc, note) => {
            return Math.max(acc, String(note.fret).length)
        }, 1);
    }
}
