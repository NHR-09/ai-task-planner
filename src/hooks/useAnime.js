import { useEffect } from 'react';
import anime from 'animejs';

export const useAnimeEntry = (selector, delay = 0) => {
  useEffect(() => {
    anime({
      targets: selector,
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: delay }),
      easing: 'easeOutElastic(1, .8)',
      duration: 800
    });
  }, [selector, delay]);
};
