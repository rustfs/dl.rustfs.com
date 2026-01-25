import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";


const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const language = className ? className.replace(/language-/, "") : "";
  if (inline) {
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-900/95">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, background: "transparent" }}
        codeTagProps={{ style: { background: "transparent" } }}
      >
        {React.Children.toArray(children).join("")}
      </SyntaxHighlighter>
    </div>
  );
};

export default function Markdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-neutral max-w-none break-words text-sm leading-relaxed dark:prose-invert prose-a:text-foreground prose-a:underline prose-a:decoration-border/60 prose-a:underline-offset-4 prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: linkChildren, ...props }) => {
            if (!href) return <a {...props}>{linkChildren}</a>;
            return (
              <Link href={href} {...props}>
                {linkChildren}
              </Link>
            );
          },
          code: CodeBlock,
        }}
      >
        {React.Children.toArray(children).join("")}
      </ReactMarkdown>
    </div>
  );
}
