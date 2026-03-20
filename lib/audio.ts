let audioCtx: AudioContext | null = null;
let leftOsc: OscillatorNode | null = null;
let rightOsc: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export function startBinauralBeats() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  
  // Create stereo merger
  const merger = audioCtx.createChannelMerger(2);
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.15; // audible but not distracting — NEEDS HEADPHONES
  
  // Left ear: 200 Hz
  leftOsc = audioCtx.createOscillator();
  leftOsc.type = 'sine';
  leftOsc.frequency.value = 200;
  const leftGain = audioCtx.createGain();
  leftGain.gain.value = 1;
  leftOsc.connect(leftGain);
  leftGain.connect(merger, 0, 0);
  
  // Right ear: 206 Hz (6 Hz theta difference)
  rightOsc = audioCtx.createOscillator();
  rightOsc.type = 'sine';
  rightOsc.frequency.value = 206;
  const rightGain = audioCtx.createGain();
  rightGain.gain.value = 1;
  rightOsc.connect(rightGain);
  rightGain.connect(merger, 0, 1);
  
  merger.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  leftOsc.start();
  rightOsc.start();
}

export function stopBinauralBeats() {
  if (leftOsc) { try { leftOsc.stop(); } catch {} leftOsc = null; }
  if (rightOsc) { try { rightOsc.stop(); } catch {} rightOsc = null; }
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  gainNode = null;
}

export function speakSpanish(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.2; // faster to keep up with RSVP pacing
    utterance.pitch = 1;
    
    // Try to find a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    // Fallback timeout
    setTimeout(resolve, 3000);
  });
}
