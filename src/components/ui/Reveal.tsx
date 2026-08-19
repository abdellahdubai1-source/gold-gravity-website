"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 *
 * Content is ALWAYS visible by default — server-rendered, before
 * hydration, and if JS never runs at all (see the `.reveal` base rule
 * in globals.css, which is opacity: 1). The hidden "about to animate
 * in" state (`.armed`) is only applied after this component has
 * actually mounted on the client AND confirmed IntersectionObserver is
 * available, so the reveal animation is strictly progressive
 * enhancement: if hydration is delayed, fails, or IntersectionObserver
 * is unsupported, the element simply keeps its default visible state
 * and never animates, instead of ever getting stuck invisible.
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
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    setArmed(true);
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
      className={cn("reveal", armed && "armed", visible && "in-view", className)}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Component>
  );
}
