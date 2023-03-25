import Soundfont, { InstrumentName } from 'soundfont-player';
import Note from './note';
import Section from './section';

export default class Player {
  private static context: AudioContext;

  private static player: Soundfont.Player;

  private interval?: NodeJS.Timer;

  private bpm = 120;

  private section?: Section;

  private pointer = 0;

  public static async initialise() {
    Player.context = new AudioContext();

    // The typedef for this API call is wrong.
    Player.player = await Soundfont.instrument(
      this.context,
      (import.meta.env.BASE_URL + 'electric-guitar.js') as InstrumentName
    );
  }

  public setBpm(bpm: number): Player {
    this.bpm = bpm;

    return this;
  }

  public playSection(section: Section): Player {
    if (!Player.player) {
      throw new Error('Soundfont player is not initialised!');
    }

    this.section = section;
    this.pointer = 0;

    this.interval = setInterval(() => {
      this.playColumn();
      this.incrementPointer();
    }, (60 / this.bpm) * 1000);

    return this;
  }

  private playColumn(): void {
    Player.player.stop();

    this.section?.columns.at(this.pointer)?.positions.forEach((position) => {
      if (position.isPlayable() && this.section) {
        const note = Note.forFret(position.fretNumber(), this.section.getRootNoteForString(position.string));

        if (note.isRealisticOctave()) {
          Player.player.play(note.asString());
        }
      }
    });
  }

  public stop() {
    if (!Player.player) {
      throw new Error('Soundfont player is not initialised!');
    }

    Player.player.stop();
    clearInterval(this.interval);
  }

  private incrementPointer(): void {
    this.pointer++;

    if (this.section && this.pointer >= this.section.columns.length) {
      this.pointer = 0;
    }
  }
}
