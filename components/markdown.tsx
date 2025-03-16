import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


type CodeBlockProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const language = className ? className.replace(/language-/, '') : '';
  if (inline) {
    return <code {...props}>{children}</code>;
  }

  return (
    <div className="code-block">
      <SyntaxHighlighter language={language} style={vscDarkPlus} {...props}>
        {React.Children.toArray(children).join('')}
      </SyntaxHighlighter>
    </div>
  );
}

export default function Markdown({ children }: { children: React.ReactNode }) {
  return (

    <div className="prose break-words">
      <ReactMarkdown
        components={{
          a: ({ href, children, ...props }) => {
            if (!href) return <a {...props}>{children}</a>;
            return <Link href={href} {...props}>{children}</Link>;
          },
          code: CodeBlock,
        }}
      >
        {React.Children.toArray(children).join('')}
      </ReactMarkdown>
    </div>
  )
}
