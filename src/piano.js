const keys = {
    BLACK_KEY: 'BLACK_KEY',
    WHITE_KEY: 'WHITE_KEY'
};
const notes = {
    'C': 1,
    'C#': 2,
    'D': 3,
    'D#': 4,
    'E': 5,
    'F': 6,
    'F#': 7,
    'G': 8,
    'G#': 9,
    'A': 10,
    'A#': 11,
    'B': 12
};
const _notes = [
    null, 'C', 'C#', 'D',
    'D#', 'E', 'F', 'F#',
    'G', 'G#', 'A', 'A#',
    'B'
];
const getNote = (index) => {
    return _notes[index] || null;
};
const getNoteIndex = (key, index) => {
    return key + ((Math.ceil(index / 12)) * 12) - 12;
}
const getKeyType = (index) => {
    /*
      C C# D D# E F F# G G# A A# B
      _____________________________
      |  | | | |  |  | | | | | |  |
      |  | | | |  |  | | | | | |  |
      |  | | | |  |  | | | | | |  |
      |  |_| |_|  |  |_| |_| |_|  |
      |   |   |   |   |   |   |   |
      |   |   |   |   |   |   |   |
      |___|___|___|___|___|___|___|
      
      !___________!!______________!
         Group 1        Group 2

      By dividing the keyboard into two groups,
      it makkes it easier to determine the type
      of the key. Group one is defined as any key
      below F but above B; while group two is
      any key above F but below C.
    */
    return index < getNoteIndex(notes.F, index) ?
        (index % 2 ? keys.WHITE_KEY : keys.BLACK_KEY) : // <-- Group 1
        (index % 2 ? keys.BLACK_KEY : keys.WHITE_KEY); // <-- Group 2
};

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const SIZE = 1.3;

canvas.width = 1000 * SIZE;
canvas.height = 200 * SIZE;

const KEY_AMMOUNT = 88;
const FIRST_NOTE = notes.A;
const WHITE_KEYS = Math.ceil(KEY_AMMOUNT - (5 * (KEY_AMMOUNT / 12))) + 1
const KEY_WIDTH = Math.floor(canvas.width / WHITE_KEYS);
const KEY_HEIGHT = canvas.height;
const BLACK_KEY_OFFSET_Y = -(canvas.height * 0.45);
const BLACK_KEY_OFFSET_X = canvas.width * 0.012;
const KEY_NAME_OFFSET = canvas.height * 0.025;
const FONT_SIZE = 10;
const CLEAN_PIXEL = 0.5;

// Bounding boxes for all keys
const keyRects = [];

for (let keyIndex = 0, whiteKeys = 0; keyIndex < KEY_AMMOUNT; keyIndex++) {
    context.beginPath();

    let normalizedIndex = (keyIndex + FIRST_NOTE)
    let thisKeyIndex = normalizedIndex % 12;
    if (thisKeyIndex <= 0 && keyIndex > 0) {
        thisKeyIndex = 12;
    };

    const thisNote = getNote(thisKeyIndex);
    const thisKeyType = getKeyType(normalizedIndex);

    if (thisKeyType === keys.WHITE_KEY) {
        whiteKeys++;
        let thisX = Math.floor(whiteKeys * KEY_WIDTH) - CLEAN_PIXEL;
        let thisY = 0;

        context.moveTo(thisX, thisY);
        if (!keyIndex) {
            context.lineTo(thisX, KEY_HEIGHT);
            context.moveTo(thisX, thisY);
        };
        context.lineTo(thisX + KEY_WIDTH, 0);
        context.lineTo(thisX + KEY_WIDTH, KEY_HEIGHT);
        context.lineTo(thisX, KEY_HEIGHT);

        context.font = FONT_SIZE + 'px serif';
        context.fillText(thisNote, thisX + (KEY_WIDTH / 2) - (FONT_SIZE / 2), KEY_HEIGHT - KEY_NAME_OFFSET);

        keyRects.push({
            x: thisX,
            y: thisY,
            w: thisX + KEY_WIDTH,
            h: KEY_HEIGHT,
            target: thisNote
        });
    } else {
        const thisX = Math.floor(whiteKeys * KEY_WIDTH) - CLEAN_PIXEL + BLACK_KEY_OFFSET_X,
            thisY = BLACK_KEY_OFFSET_Y,
            thisW = KEY_WIDTH - (KEY_WIDTH / 4),
            thisH = KEY_HEIGHT;
        context.fillRect(thisX, thisY, thisW, thisH);
        keyRects.push({
            x: thisX,
            y: thisY,
            w: thisW,
            h: thisH,
            target: thisNote
        });
    };
    context.stroke();
};