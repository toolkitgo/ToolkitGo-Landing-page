import type { ReactNode } from "react";

/** Server-rendered content enhanced by a scoped client animation boundary. */
export interface SectionMotionProps {
  children: ReactNode;
}

export interface BookingStep {
  title: string;
  titleLines: readonly string[];
  description: string;
  image: string;
  caption: string;
}

export interface BookingSequenceProps extends SectionMotionProps {
  steps: readonly BookingStep[];
}

/** Keep the same content in view when responsive pin spacing is removed or added. */
export interface ScrollViewportAnchor {
  element: HTMLElement;
  top: number;
}
