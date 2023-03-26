import Semitone from '../enum/semitone';

export default class Note {
  public constructor(public readonly semitone: Semitone, public readonly octave: number) {}

  public static forFret(fret: number, rootNote: Note) {
    return rootNote.addSemitones(fret);
  }

  public static create(): Note {
    return new Note(Semitone.C, 4);
  }

  public static createFromJson(json: Record<string, unknown>): Note {
    if (typeof json.semitone === 'string' && typeof json.octave === 'number') {
      return new Note(Semitone[json.semitone as keyof typeof Semitone], json.octave);
    }

    throw new Error('Cannot create Note from json!');
  }

  public addSemitones(semitones: number): Note {
    const octavesToAdd = Math.floor(semitones / 12);
    const semitonesToAdd = Math.floor(semitones % 12);
    const indexedSemitones = this.indexedSemitones().splice(this.indexedSemitones().indexOf(this.semitone));

    if (
      this.indexedSemitones().indexOf(this.semitone) < 12 &&
      this.indexedSemitones().indexOf(this.semitone) + semitonesToAdd >= 12
    ) {
      return new Note(indexedSemitones[semitonesToAdd], this.octave + octavesToAdd + 1);
    }

    return new Note(indexedSemitones[semitonesToAdd], this.octave + octavesToAdd);
  }

  public removeSemitones(semitones: number): Note {
    const octavesToRemove = Math.floor(semitones / 12);
    const semitonesToRemove = Math.floor(semitones % 12);
    const indexedSemitones = this.indexedSemitones()
      .reverse()
      .splice(this.indexedSemitones().reverse().indexOf(this.semitone));

    if (semitonesToRemove >= indexedSemitones.length - 12) {
      // pass C.
      return new Note(indexedSemitones[semitonesToRemove], this.octave - octavesToRemove - 1);
    }

    return new Note(indexedSemitones[semitonesToRemove], this.octave - octavesToRemove);
  }

  public isRealisticOctave(): boolean {
    return this.octave >= 0 && this.octave <= 7;
  }

  public asString(): string {
    return `${this.semitone.valueOf()}${this.octave}`;
  }

  public toJson(): Record<string, unknown> {
    return {
      semitone: this.semitone.valueOf(),
      octave: this.octave,
    };
  }

  public indexedSemitones(): Semitone[] {
    return [
      Semitone.C,
      Semitone.CSharp,
      Semitone.D,
      Semitone.DSharp,
      Semitone.E,
      Semitone.F,
      Semitone.FSharp,
      Semitone.G,
      Semitone.GSharp,
      Semitone.A,
      Semitone.ASharp,
      Semitone.B,
      Semitone.C,
      Semitone.CSharp,
      Semitone.D,
      Semitone.DSharp,
      Semitone.E,
      Semitone.F,
      Semitone.FSharp,
      Semitone.G,
      Semitone.GSharp,
      Semitone.A,
      Semitone.ASharp,
      Semitone.B,
    ];
  }
}
