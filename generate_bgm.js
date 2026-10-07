const fs = require('fs');
global.MPEGMode = require('./node_modules/lamejs/src/js/MPEGMode.js');
global.Lame = require('./node_modules/lamejs/src/js/Lame.js');
global.Presets = require('./node_modules/lamejs/src/js/Presets.js');
global.GainAnalysis = require('./node_modules/lamejs/src/js/GainAnalysis.js');
global.QuantizePVT = require('./node_modules/lamejs/src/js/QuantizePVT.js');
global.Quantize = require('./node_modules/lamejs/src/js/Quantize.js');
global.Takehiro = require('./node_modules/lamejs/src/js/Takehiro.js');
global.Reservoir = require('./node_modules/lamejs/src/js/Reservoir.js');
global.BitStream = require('./node_modules/lamejs/src/js/BitStream.js');
global.Encoder = require('./node_modules/lamejs/src/js/Encoder.js');
global.Version = require('./node_modules/lamejs/src/js/Version.js');
global.VBRTag = require('./node_modules/lamejs/src/js/VBRTag.js');
const lamejs = require('lamejs');

const sampleRate = 44100;
const bpm = 132;
const beatDuration = 60 / bpm; // ~0.4545s
const totalBars = 8;
const beatsPerBar = 4;
const totalDuration = totalBars * beatsPerBar * beatDuration; // ~14.5s loop
const totalSamples = Math.floor(sampleRate * totalDuration);

const buffer = new Float32Array(totalSamples);

// Helper frequencies
const noteFreqs = {
    'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'Bb3': 233.08,
    'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'F4': 349.23, 'G4': 392.00, 'Ab4': 415.30, 'Bb4': 466.16,
    'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'F5': 698.46, 'G5': 783.99, 'Ab5': 830.61, 'Bb5': 932.33,
    'C6': 1046.50
};

// Chord progressions across 8 bars: Cm -> Ab -> Bb -> Gm -> Cm -> Ab -> Bb -> C5
const chords = [
    ['C3', 'Eb3', 'G3', 'C4'],
    ['Ab3', 'C4', 'Eb4', 'Ab4'],
    ['Bb3', 'D4', 'F4', 'Bb4'],
    ['G3', 'Bb3', 'D4', 'G4'],
    ['C3', 'Eb3', 'G3', 'C4'],
    ['Ab3', 'C4', 'Eb4', 'Ab4'],
    ['Bb3', 'D4', 'F4', 'Bb4'],
    ['C4', 'Eb4', 'G4', 'C5']
];

// Melody notes (bar, beat, durationBeats, note)
const melody = [
    // Bar 1 (Cm)
    [0, 0.0, 0.5, 'C5'], [0, 0.5, 0.5, 'Eb5'], [0, 1.0, 1.0, 'G5'], [0, 2.0, 0.5, 'F5'], [0, 2.5, 0.5, 'Eb5'], [0, 3.0, 1.0, 'D5'],
    // Bar 2 (Ab)
    [1, 0.0, 0.5, 'Eb5'], [1, 0.5, 0.5, 'C5'], [1, 1.0, 1.5, 'Ab5'], [1, 2.5, 0.5, 'G5'], [1, 3.0, 1.0, 'F5'],
    // Bar 3 (Bb)
    [2, 0.0, 0.5, 'D5'], [2, 0.5, 0.5, 'F5'], [2, 1.0, 1.0, 'Bb5'], [2, 2.0, 0.5, 'Ab5'], [2, 2.5, 0.5, 'G5'], [2, 3.0, 1.0, 'F5'],
    // Bar 4 (Gm)
    [3, 0.0, 0.5, 'Eb5'], [3, 0.5, 0.5, 'D5'], [3, 1.0, 1.0, 'C5'], [3, 2.0, 1.0, 'D5'], [3, 3.0, 1.0, 'G4'],
    // Bar 5 (Cm)
    [4, 0.0, 0.5, 'C5'], [4, 0.5, 0.5, 'G5'], [4, 1.0, 0.5, 'C6'], [4, 1.5, 0.5, 'Bb5'], [4, 2.0, 1.0, 'G5'], [4, 3.0, 1.0, 'Eb5'],
    // Bar 6 (Ab)
    [5, 0.0, 0.5, 'F5'], [5, 0.5, 0.5, 'Ab5'], [5, 1.0, 1.5, 'C6'], [5, 2.5, 0.5, 'Bb5'], [5, 3.0, 1.0, 'Ab5'],
    // Bar 7 (Bb)
    [6, 0.0, 0.5, 'G5'], [6, 0.5, 0.5, 'Bb5'], [6, 1.0, 1.0, 'D6'], [6, 2.0, 0.5, 'C6'], [6, 2.5, 0.5, 'Bb5'], [6, 3.0, 1.0, 'G5'],
    // Bar 8 (C)
    [7, 0.0, 1.0, 'C6'], [7, 1.0, 1.0, 'G5'], [7, 2.0, 2.0, 'C5']
];

// Synth oscillators
function squareWave(phase, duty = 0.5) {
    return (phase % 1.0) < duty ? 0.35 : -0.35;
}

function triangleWave(phase) {
    const p = phase % 1.0;
    return (Math.abs(p - 0.5) * 4 - 1) * 0.4;
}

// Generate sound
for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const currentBar = Math.floor(t / (4 * beatDuration));
    const barProgress = (t % (4 * beatDuration)) / beatDuration; // 0 to 4
    const beatIndex = Math.floor(t / beatDuration);
    const timeInBeat = (t % beatDuration);

    let sample = 0;

    // 1. Kick Drum (on beats 0, 2 in each bar)
    const isKickBeat = (Math.floor(barProgress) === 0 || Math.floor(barProgress) === 2);
    if (isKickBeat && timeInBeat < 0.18) {
        const kickEnv = Math.exp(-timeInBeat * 25);
        const kickFreq = 150 * Math.exp(-timeInBeat * 35) + 45;
        sample += Math.sin(2 * Math.PI * kickFreq * timeInBeat) * kickEnv * 0.45;
    }

    // 2. Snare Drum (on beats 1, 3 in each bar)
    const isSnareBeat = (Math.floor(barProgress) === 1 || Math.floor(barProgress) === 3);
    if (isSnareBeat && timeInBeat < 0.2) {
        const snareEnv = Math.exp(-timeInBeat * 20);
        const noise = (Math.random() * 2 - 1) * 0.35;
        const tone = Math.sin(2 * Math.PI * 180 * timeInBeat) * 0.2;
        sample += (noise + tone) * snareEnv * 0.4;
    }

    // 3. Hi-hat (8th notes)
    const eighthIndex = Math.floor((t % beatDuration) / (beatDuration / 2));
    const timeInEighth = t % (beatDuration / 2);
    if (timeInEighth < 0.05) {
        const hatEnv = Math.exp(-timeInEighth * 80);
        sample += (Math.random() * 2 - 1) * hatEnv * 0.12;
    }

    // 4. Bass Line (Square/Saw pulse following chord root)
    if (currentBar < chords.length) {
        const chordNotes = chords[currentBar];
        const rootFreq = noteFreqs[chordNotes[0]];
        const bassEnv = Math.exp(-timeInEighth * 12);
        const bassPhase = t * rootFreq;
        sample += squareWave(bassPhase, 0.4) * bassEnv * 0.32;
    }

    // 5. Arpeggio (16th notes fast chiptune flutter)
    const sixteenth = Math.floor((t % beatDuration) / (beatDuration / 4));
    if (currentBar < chords.length) {
        const chordNotes = chords[currentBar];
        const arpNote = chordNotes[sixteenth % chordNotes.length];
        const arpFreq = noteFreqs[arpNote] * 2; // an octave higher
        const arpPhase = t * arpFreq;
        const arpEnv = Math.exp(-(t % (beatDuration / 4)) * 25);
        sample += triangleWave(arpPhase) * arpEnv * 0.22;
    }

    // 6. Lead Melody
    for (const [mBar, mBeat, mDur, mNote] of melody) {
        if (mBar === currentBar) {
            const mStart = mBeat * beatDuration;
            const mEnd = mStart + mDur * beatDuration;
            const barTime = t % (4 * beatDuration);
            if (barTime >= mStart && barTime < mEnd) {
                const noteTime = barTime - mStart;
                const freq = noteFreqs[mNote];
                const melEnv = Math.min(1, noteTime * 50) * Math.exp(-noteTime * 1.5);
                const vibrato = 1 + 0.015 * Math.sin(2 * Math.PI * 6 * noteTime);
                sample += squareWave(t * freq * vibrato, 0.5) * melEnv * 0.35;
                break;
            }
        }
    }

    // Master limiting / soft clipping
    buffer[i] = Math.max(-0.95, Math.min(0.95, sample * 1.1));
}

// Convert float samples to 16-bit PCM
const pcm = new Int16Array(totalSamples);
for (let i = 0; i < totalSamples; i++) {
    pcm[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32767));
}

// Encode to MP3 using lamejs
const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
const sampleBlockSize = 1152;
const mp3Data = [];

for (let i = 0; i < pcm.length; i += sampleBlockSize) {
    const chunk = pcm.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) {
        mp3Data.push(Buffer.from(mp3buf));
    }
}

const endBuf = mp3encoder.flush();
if (endBuf.length > 0) {
    mp3Data.push(Buffer.from(endBuf));
}

const finalBuffer = Buffer.concat(mp3Data);
fs.writeFileSync('assets/audio/bgm.mp3', finalBuffer);
console.log(`Generated assets/audio/bgm.mp3 (${finalBuffer.length} bytes, duration: ${totalDuration.toFixed(2)}s)`);
