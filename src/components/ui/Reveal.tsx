"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * No dependency needed; respects prefers-reduced-motion via CSS
 * (see globals.css) and degrades to always-visible if JS is slow to
 * hydrate (opacity is only removed once observed, not added by JS).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={cn("reveal", visible && "in-view", className)}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Component>
  );
}
