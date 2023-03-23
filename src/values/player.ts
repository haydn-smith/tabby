import Soundfont from 'soundfont-player';
import Note from './note';
import Section from './section';

export default class Player {
  private static context: AudioContext;

  private static player: Soundfont.Player;

  private interval?: NodeJS.Timer;

  private bpm = 120;

  private section?: Section;

  private pointer = 0;

  private playing = false;

  public static async initialise() {
    Player.context = new AudioContext();

    // The typedef for this API call is wrong.
    // @ts-ignore
    Player.player = await Soundfont.instrument(this.context, '/electric-guitar.js');
  }

  public setBpm(bpm: number): this {
    this.bpm = bpm;

    return this;
  }

  public playSection(section: Section): void {
    if (!Player.player) {
      throw new Error('Soundfont player is not initialised!');
    }

    this.section = section;
    this.pointer = 0;
    this.playing = true;

    this.interval = setInterval(() => {
      this.playColumn();
      this.incrementPointer();
    }, (60 / this.bpm) * 1000);
  }

  private isPlaying(): boolean {
    return this.playing;
  }

  private playColumn(): void {
    Player.player.stop();

    this.section.columns.at(this.pointer)?.notes.forEach((note) => {
      if (note.isPlayable()) {
        Player.player.play(Note.forFret(note.fretNumber(), this.section.rootNoteForString(note.string)).asString());
      }
    });
  }

  public stop() {
    this.playing = false;
    Player.player.stop();
    clearInterval(this.interval);
  }

  private incrementPointer(): void {
    this.pointer++;

    if (this.pointer >= this.section.columns.length) {
      this.pointer = 0;
    }
  }
}
