import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const Component = Tag as any;
  return (
    <Component className={cn("mx-auto w-full max-w-8xl container-px", className)}>
      {children}
    </Component>
  );
}
