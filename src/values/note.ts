import Modifier from "../enum/modifier";

export default class Note {
    public constructor(
        public string: number,
        public fret: string,
        public modifier: Modifier,
    ) {
    }
}
