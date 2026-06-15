export { useReducedMotion } from "motion/react";

export const EASE_CH = [0.25, 0.1, 0.25, 1] as const;

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  hero: 0.8,
} as const;

export const STAGGER = {
  tight: 0.04,
  normal: 0.05,
  relaxed: 0.06,
  children: 0.05,
  fast: 0.04,
} as const;

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: DURATION.normal, ease: EASE_CH },
} as const;

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: STAGGER.children, delayChildren: 0.04 },
  },
} as const;

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_CH },
  },
} as const;
