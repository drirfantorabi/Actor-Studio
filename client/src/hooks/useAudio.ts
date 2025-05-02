import { useCallback } from 'react';
import { Howl } from 'howler';

export const useAudio = () => {
  const play = useCallback((audioSrc: string, onEnd?: () => void) => {
    try {
      const sound = new Howl({
        src: [audioSrc],
        html5: true,
      });

      sound.once('load', () => {
        sound.play();
      });

      if (onEnd) {
        sound.once('end', onEnd);
      }

      // Handle errors
      sound.once('loaderror', (id, err) => {
        console.error('Error loading audio:', err);
        // If there's an error, still call onEnd to avoid blocking the app flow
        if (onEnd) onEnd();
      });

      sound.once('playerror', (id, err) => {
        console.error('Error playing audio:', err);
        // If there's an error, still call onEnd to avoid blocking the app flow
        if (onEnd) onEnd();
      });

      return sound;
    } catch (error) {
      console.error('Failed to create audio instance:', error);
      // If there's an error, still call onEnd to avoid blocking the app flow
      if (onEnd) onEnd();
      return null;
    }
  }, []);

  return { play };
};
