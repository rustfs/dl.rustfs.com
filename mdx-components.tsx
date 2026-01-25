import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      if (!href) return <a {...props}>{children}</a>;
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    },
    ...components,
  };
}
