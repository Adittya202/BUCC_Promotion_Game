/**
 * BUCC Dino Runner & Boss Shooter - Audio System
 * Manages background music (assets/audio/bgm.mp3) and procedural Web Audio arcade SFX.
 */

class SoundSystem {
  constructor() {
    this.bgmAudio = null;
    this.isMuted = false;
    this.audioContext = null;
    this.hasUserInteracted = false;
    this.bgmPlaying = false;
    this.fallbackSynthActive = false;
    this.fallbackSynthTimer = null;

    // Retrieve mute setting from localStorage
    const savedMute = localStorage.getItem("bucc_game_muted");
    if (savedMute !== null) {
      this.isMuted = savedMute === "true";
    }

    this.initAudioElement();
    this.bindFirstInteraction();
  }

  initAudioElement() {
    this.bgmAudio = document.getElementById("bgmAudio");
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio("assets/audio/bgm.mp3");
      this.bgmAudio.id = "bgmAudio";
      this.bgmAudio.loop = true;
      document.body.appendChild(this.bgmAudio);
    }
    this.bgmAudio.volume = 0.5;
    this.bgmAudio.muted = this.isMuted;

    // If audio element encounters an error, fallback to procedural Web Audio synth
    this.bgmAudio.addEventListener("error", () => {
      console.warn("[SoundSystem] bgm.mp3 failed to load via HTMLAudio. Activating Web Audio synthesizer.");
      if (this.hasUserInteracted && !this.isMuted) {
        this.startFallbackBgmSynth();
      }
    });
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  bindFirstInteraction() {
    const handleFirstInteraction = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.ensureAudioContext();
        this.playBgm();
      }
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("mousedown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("keydown", handleFirstInteraction, { passive: true });
    window.addEventListener("mousedown", handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
  }

  playBgm() {
    if (this.isMuted) return;

    if (this.bgmAudio) {
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.bgmPlaying = true;
          })
          .catch((err) => {
            console.warn("[SoundSystem] Autoplay blocked or bgm error:", err);
            this.startFallbackBgmSynth();
          });
      }
    } else {
      this.startFallbackBgmSynth();
    }
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.stopFallbackBgmSynth();
    this.bgmPlaying = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("bucc_game_muted", this.isMuted);

    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }

    if (this.isMuted) {
      this.pauseBgm();
    } else {
      this.ensureAudioContext();
      this.playBgm();
    }

    this.updateMuteUI();
    return this.isMuted;
  }

  updateMuteUI() {
    const muteBtns = document.querySelectorAll(".btn-toggle-mute");
    muteBtns.forEach((btn) => {
      if (this.isMuted) {
        btn.classList.add("muted");
        btn.setAttribute("title", "Unmute Audio");
        btn.innerHTML = `<span class="icon">&#128263;</span>`;
      } else {
        btn.classList.remove("muted");
        btn.setAttribute("title", "Mute Audio");
        btn.innerHTML = `<span class="icon">&#128266;</span>`;
      }
    });
  }

  /* =========================================================================
     Procedural Web Audio Arcade SFX
     ========================================================================= */

  playJump() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playCoin() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Dual-bell chime
    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.15);
    });
  }

  playShoot(weaponType = "pistol") {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    if (weaponType === "cannon") {
      // Deep heavy cannon explosion/laser
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (weaponType === "blaster") {
      // High-pitched rapid dual blaster
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else {
      // Standard pistol
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  }

  playEnemyShoot() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playHit() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Noise buffer crunch
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  playShieldDeflect() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Resonant futuristic deflect ping (dual harmonics)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1600, now);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.14);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(2400, now);
    osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);
  }

  playShieldBreak() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Electric overload zap + sub crunch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
  }

  playShieldUp() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Rising energy field hum
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playPromotionFanfare() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.15 }, // G5
      { f: 1046.5, t: 0.39, d: 0.45 }  // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.3, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  playGameOver() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const notes = [
      { f: 440, t: 0.0, d: 0.2 },
      { f: 415.3, t: 0.2, d: 0.2 },
      { f: 392, t: 0.4, d: 0.2 },
      { f: 349.23, t: 0.6, d: 0.5 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.25, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.01, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  playVictory() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 523.25, t: 0.3, d: 0.15 },
      { f: 659.25, t: 0.45, d: 0.3 },
      { f: 783.99, t: 0.75, d: 0.3 },
      { f: 1046.5, t: 1.05, d: 0.8 }
    ];

    fanfare.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.28, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  playAlarm() {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.18);
    osc.frequency.linearRampToValueAtTime(800, now + 0.36);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.37);
  }

  /* =========================================================================
     Fallback Web Audio Chiptune Synthesizer
     ========================================================================= */
  startFallbackBgmSynth() {
    if (this.fallbackSynthActive || this.isMuted) return;
    this.fallbackSynthActive = true;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    const pattern = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 440.0, 349.23];
    let noteIdx = 0;

    this.fallbackSynthTimer = setInterval(() => {
      if (this.isMuted || !this.fallbackSynthActive) return;
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const freq = pattern[noteIdx % pattern.length];
      noteIdx++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }, 250);
  }

  stopFallbackBgmSynth() {
    this.fallbackSynthActive = false;
    if (this.fallbackSynthTimer) {
      clearInterval(this.fallbackSynthTimer);
      this.fallbackSynthTimer = null;
    }
  }
}

// Global Sound Instance
const Sounds = new SoundSystem();
