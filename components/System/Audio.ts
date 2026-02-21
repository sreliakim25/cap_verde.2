/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export class AudioController {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  // Track management
  bgmSource: AudioBufferSourceNode | null = null;
  bgmGain: GainNode | null = null;
  currentTrack: number = 0;
  tracks: string[] = ['/track1.mp3', '/track2.mp3']; // The expected filenames in public folder
  audioBuffers: (AudioBuffer | null)[] = [null, null];

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            // Force play the current track if it was queued
            if (this.currentTrack !== undefined && !this.bgmSource) {
              this.playBGM(this.currentTrack);
            }
          }).catch(() => { });
        } else if (this.ctx && this.ctx.state === 'running' && !this.bgmSource) {
          this.playBGM(this.currentTrack);
        }

        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('click', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('touchstart', unlockAudio);
    }
  }

  // Pre-load the audio files
  async loadTracks() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    for (let i = 0; i < this.tracks.length; i++) {
      try {
        const response = await fetch(this.tracks[i]);
        if (!response.ok) {
          console.warn(`Could not load audio track: ${this.tracks[i]}`);
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffers[i] = await this.ctx.decodeAudioData(arrayBuffer);
        console.log(`Loaded track ${i + 1}`);
      } catch (e) {
        console.warn(`Error loading ${this.tracks[i]}:`, e);
      }
    }
  }

  playBGM(trackIndex: number) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Validate track index
    if (trackIndex < 0 || trackIndex >= this.tracks.length) return;

    // If already playing the requested track, do nothing
    if (this.currentTrack === trackIndex && this.bgmSource && this.bgmGain && this.bgmGain.gain.value > 0) {
      return;
    }

    // Stop current track if playing
    this.stopBGM();
    this.currentTrack = trackIndex;

    // Ensure we have a buffer to play
    const buffer = this.audioBuffers[this.currentTrack];
    if (!buffer) {
      // If not loaded yet, try to load and then play
      this.loadTracks().then(() => {
        if (this.audioBuffers[this.currentTrack]) {
          this.playBGM(this.currentTrack);
        }
      });
      return;
    }

    this.bgmSource = this.ctx.createBufferSource();
    this.bgmSource.buffer = buffer;
    this.bgmSource.loop = true; // Loop the current track continuously

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.5; // BGM Volume (slightly quieter than SFX)

    this.bgmSource.connect(this.bgmGain);
    this.bgmGain.connect(this.masterGain);

    if (this.ctx.state === 'running') {
      this.bgmSource.start(0);
    }
  }

  stopBGM() {
    if (this.bgmSource) {
      // Prevent onended from immediately starting the next track
      if (this.bgmGain) this.bgmGain.gain.value = 0;

      try {
        this.bgmSource.stop();
      } catch (e) { }
      this.bgmSource.disconnect();
      this.bgmSource = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
  }

  init() {
    if (!this.ctx) {
      // Support for standard and webkit prefixed AudioContext
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4; // Master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }

  playGemCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // High pitch "ding" with slight upward inflection
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLetterCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Play a major chord (C Majorish: C5, E5, G5) for a rewarding sound
    const freqs = [523.25, 659.25, 783.99];

    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = f;

      // Stagger start times slightly for an arpeggio feel
      const start = t + (i * 0.04);
      const dur = 0.3;

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(start);
      osc.stop(start + dur);
    });
  }

  playJump(isDouble = false) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sine wave for a smooth "whoop" sound
    osc.type = 'sine';

    // Pitch shift up for double jump
    const startFreq = isDouble ? 400 : 200;
    const endFreq = isDouble ? 800 : 450;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.15);

    // Lower volume for jump as it is a frequent action
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playDamage() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // 1. Noise buffer for "crunch/static"
    const bufferSize = this.ctx.sampleRate * 0.3; // 0.3 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // 2. Low oscillator for "thud/impact"
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
    noise.start(t);
    noise.stop(t + 0.3);
  }
}

export const audio = new AudioController();
