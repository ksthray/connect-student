// src/hooks/useIntersectionObserver.ts
import { useRef, useEffect, useState } from "react";

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (options: Options = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      // L'élément est visible (intersecting)
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    // Nettoyage
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options, options.root, options.rootMargin, options.threshold]); // Dépendances de l'observer

  // Retourne la référence à placer sur l'élément et l'état
  return { ref, isIntersecting };
};
