import { useEffect } from 'react';

/**
 * Call `handler` when a click occurs outside the element referenced by `ref`.
 */
export default function useClickOutside(ref, handler) {
  useEffect(() => {
    if (!handler) return;
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, handler]);
}
