import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Remount outlet on pathname change. No route-level opacity animation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="h-full min-h-0">
      {children}
    </div>
  );
}
