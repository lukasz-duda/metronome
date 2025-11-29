export function play() {
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value = 600;
  const gainNode = audio.createGain();
  gainNode.gain.value = 0.1;
  oscillator.connect(gainNode);
  gainNode.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.05);
}
