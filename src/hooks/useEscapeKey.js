import { useEffect } from 'react';

/**
 * Call `handler` when the Escape key is pressed.
 */
export default function useEscapeKey(handler) {
  useEffect(() => {
    if (!handler) return;
    const onKey = (e) => { if (e.key === 'Escape') handler(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler]);
}
