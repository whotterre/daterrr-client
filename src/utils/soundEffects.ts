
/**
 * Utility for playing sound effects in the app
 */

// Sound effect URLs - using free sounds from mixkit.co
const SOUND_EFFECTS = {
    swipe: "https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3",
    message: "https://assets.mixkit.co/active_storage/sfx/2365/2365-preview.mp3"
  };
  
  // Cached audio objects
  const audioCache: Record<string, HTMLAudioElement> = {};
  
  /**
   * Play a sound effect
   * @param soundName Name of the sound to play
   */
  export const playSound = (soundName: keyof typeof SOUND_EFFECTS) => {
    const soundUrl = SOUND_EFFECTS[soundName];
    
    // Create and cache the audio object if it doesn't exist
    if (!audioCache[soundName]) {
      audioCache[soundName] = new Audio(soundUrl);
    }
    
    // Play the sound
    const audio = audioCache[soundName];
    audio.currentTime = 0; // Reset to start
    audio.play().catch(err => console.error("Error playing sound:", err));
  };
  