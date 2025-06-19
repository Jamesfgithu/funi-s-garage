'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  link: 'text-yellow-400 underline cursor-pointer hover:text-yellow-300',
  paragraph: 'mb-2',
};

const initialConfig = {
  namespace: 'PremiumSafelistEditor',
  theme,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError: (error: Error) => console.error('Lexical Error:', error),
};

function EditorToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-600 bg-gray-800 p-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={formatBold}
          className="rounded bg-gray-700 px-3 py-1.5 font-bold text-white transition-colors hover:bg-yellow-500 hover:text-black"
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="rounded bg-gray-700 px-3 py-1.5 text-white italic transition-colors hover:bg-yellow-500 hover:text-black"
        >
          I
        </button>
        <div className="mx-2 h-6 w-px bg-gray-600"></div>
        <button
          onClick={insertLink}
          className="rounded bg-gray-700 px-3 py-1.5 text-white transition-colors hover:bg-yellow-500 hover:text-black"
        >
          🔗
        </button>
      </div>
      <div className="text-xs text-gray-400">
        400px Arial • Perfect for safelists
      </div>
    </div>
  );
}

export default function PremiumSafelistEditor() {
  return (
    <div className="bg-gray-900 p-6">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-white">
            Safelist AI Pro - Email Generator
          </h2>
          <p className="text-gray-400">
            Generate high-converting safelist emails using proven templates and
            world-class AI copywriting
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <LexicalComposer initialConfig={initialConfig}>
            <EditorToolbar />

            <div className="relative bg-gray-900">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="min-h-[400px] p-6 text-gray-100 outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-inset"
                    style={{
                      maxWidth: '400px',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  />
                }
                placeholder={
                  <div className="pointer-events-none absolute top-6 left-6 text-gray-500">
                    Start writing your safelist email...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>

            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
          </LexicalComposer>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 p-4">
            <div className="flex space-x-3">
              <button className="rounded bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
                Save Draft
              </button>
              <button className="rounded bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600">
                Preview
              </button>
            </div>
            <button className="rounded bg-yellow-500 px-6 py-2 font-medium text-black transition-colors hover:bg-yellow-400">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
