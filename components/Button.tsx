import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-bold tracking-tight transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-navy text-ivory hover:bg-navy-d",
  secondary: "border border-navy text-navy hover:bg-navy/5",
};

/** The one pill-shaped CTA used for every link-styled action across the site. */
export function Button({
  href,
  variant = "primary",
  children,
  external = false,
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  external?: boolean;
}) {
  const className = `${base} ${variants[variant]}`;

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
