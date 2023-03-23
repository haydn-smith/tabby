import Semitone from '../enum/semitone';

export default class Note {
  public constructor(private readonly semitone: Semitone, private readonly octave: number) {}

  public static forFret(fret: number, rootNote: Note) {
    return rootNote.addSemitones(fret);
  }

  public addSemitones(semitones: number): Note {
    const octavesToAdd = Math.floor(semitones / 12);
    const semitonesToAdd = Math.floor(semitones % 12);
    const indexedSemitones = this.indexedSemitones().splice(this.indexedSemitones().indexOf(this.semitone));

    return new Note(indexedSemitones[semitonesToAdd], this.octave + octavesToAdd);
  }

  public asString(): string {
    return `${this.semitone.valueOf()}${this.octave}`;
  }

  private indexedSemitones(): Semitone[] {
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
