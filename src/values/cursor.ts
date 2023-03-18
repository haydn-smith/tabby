import { clamp } from "ramda";
import Section from "./section";
import Tab from "./tab";

export default class Cursor {
    public constructor(
        private active: boolean = false,
        private section = 0,
        private column = 0,
        private string = 1
    ) {
    }

    public moveCursor(section: number, column: number, string: number): Cursor {
        return new Cursor(this.active, section, column, string);
    }

    public moveCursorFromKeyboardEvent(event: KeyboardEvent): Cursor {
        if (event.key === 'ArrowUp' && !this.active) {
         return this.moveCursorUp();
        } else if (event.key === 'ArrowDown' && !this.active) {
          return this.moveCursorDown();
        } else if (event.key === 'ArrowLeft' && !this.active) {
          return this.moveCursorLeft();
        } else if (event.key === 'ArrowRight' && !this.active) {
          return this.moveCursorRight();
        } else if (event.key === 'Enter') {
          return this.toggleActive();
        } else if (event.key === 'Escape') {
          return this.toggleActive(false);
        }

        return this;
    }

    public moveCursorUp(): Cursor {
        return new Cursor(false, this.section, this.column, this.string - 1);
    }

    public moveCursorDown(): Cursor {
        return new Cursor(false, this.section, this.column, this.string + 1);
    }

    public moveCursorLeft(): Cursor {
        return new Cursor(false, this.section, this.column - 1, this.string);
    }

    public moveCursorRight(): Cursor {
        return new Cursor(false, this.section, this.column + 1, this.string);
    }

    public toggleActive(active?: boolean): Cursor {
        return new Cursor(active === undefined ? !this.active : active, this.section, this.column, this.string);
    }

    public moveCursorWithinSectionBounds(tab: Tab): Cursor {
        return new Cursor(
            this.active,
            this.section,
            clamp(0, tab.getSection(this.section).columns.length, this.column),
            clamp(1, tab.getSection(this.section).getTuning().length, this.string)
        );
    }

    public isCurrentSection(index: number): boolean {
        return this.section === index;
    }

    public isCurrentColumn(index: number): boolean {
        return this.column === index;
    }

    public currentString(): number {
        return this.string;
    }

    public isActive(): boolean {
        return this.active;
    }
}
