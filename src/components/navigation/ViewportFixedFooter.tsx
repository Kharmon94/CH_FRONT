import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function ViewportFixedFooter({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={className}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        maxWidth: "100vw",
        zIndex: 100,
        ...style,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
