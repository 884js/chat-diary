import type React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export const MarkdownRenderer = ({
  content,
  className = '',
}: MarkdownRendererProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ children, ...props }: React.ComponentProps<'a'>) {
            return (
              <a
                className="text-blue-600 hover:underline break-words break-all"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          ul({ children, ...props }: React.ComponentProps<'ul'>) {
            return (
              <ul className="list-disc pl-5 my-2" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: React.ComponentProps<'ol'>) {
            return (
              <ol className="list-decimal pl-5 my-2" {...props}>
                {children}
              </ol>
            );
          },
          h1({ children, ...props }: React.ComponentProps<'h1'>) {
            return (
              <h1 className="text-xl font-bold my-2" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: React.ComponentProps<'h2'>) {
            return (
              <h2 className="text-lg font-bold my-2" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: React.ComponentProps<'h3'>) {
            return (
              <h3 className="text-base font-bold my-2" {...props}>
                {children}
              </h3>
            );
          },
          blockquote({ children, ...props }: React.ComponentProps<'blockquote'>) {
            return (
              <blockquote
                className="border-l-4 border-gray-300 pl-3 italic text-gray-700 my-2"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          table({ children, ...props }: React.ComponentProps<'table'>) {
            return (
              <div className="overflow-x-auto my-2">
                <table
                  className="min-w-full border-collapse border border-gray-300"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }: React.ComponentProps<'thead'>) {
            return (
              <thead className="bg-gray-100" {...props}>
                {children}
              </thead>
            );
          },
          tr({ children, ...props }: React.ComponentProps<'tr'>) {
            return (
              <tr className="border-b border-gray-300" {...props}>
                {children}
              </tr>
            );
          },
          th({ children, ...props }: React.ComponentProps<'th'>) {
            return (
              <th className="py-2 px-3 text-left font-medium" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: React.ComponentProps<'td'>) {
            return (
              <td className="py-2 px-3" {...props}>
                {children}
              </td>
            );
          },
          p({ children, ...props }: React.ComponentProps<'p'>) {
            return (
              <p className="text-sm break-words my-2" {...props}>
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};