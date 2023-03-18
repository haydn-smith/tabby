import Modifier from "../enum/modifier";
import Note from "./note";
import { v4 as uuidv4 } from 'uuid';

export default class Column {
    public id: string = '';

    public notes: Array<Note> = [];

    public static make(): Column {
        const column = new Column();

        column.id = uuidv4();

        // TODO: Dynamic string amount.
        [1, 2, 3, 4, 5, 6].forEach((string) => {
            column.notes.push(new Note(string, ''));
        });

        return column;
    }

    public static makeFromColumn(column: Column): Column {
        const newColumn = new Column();

        newColumn.id = column.id;

        newColumn.notes = column.notes.map(note => new Note(note.string, note.fret));

        return newColumn;
    }

    public getNoteForString(string: number): Note {
        // TODO: Throw error on undefined.
        return this.notes.filter((note) => note.string === string)[0];
    }

    public getCharacterWidth(): number {
        return this.notes.reduce((acc, note) => {
            return Math.max(acc, note.fret.length)
        }, 1);
    }

    public getStrings(): Array<number> {
        // TODO: This will change for ukuleles/7-strings/etc...
        return [1, 2, 3, 4, 5, 6];
    }

    public setNote(string: number, fret: string): Column {
        const column = Column.makeFromColumn(this);

        column.notes = column.notes.map((note) => {
          return (note.string === string) ? new Note(string, fret) : note;
        });

        return column;
    }
}
