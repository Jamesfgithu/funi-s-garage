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
  link: 'text-yellow-300 underline cursor-pointer hover:text-yellow-200 transition-colors',
  paragraph: 'mb-3',
};

const initialConfig = {
  namespace: 'MultimillionaireEditor',
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

function PremiumToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <div className="flex items-center justify-between border-b border-purple-500/30 bg-gradient-to-r from-gray-800/90 via-purple-800/90 to-gray-800/90 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={formatBold}
          className="transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-500"
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white italic shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-purple-500"
        >
          I
        </button>
        <div className="mx-3 h-8 w-px bg-gradient-to-b from-purple-500 to-pink-500"></div>
        <button
          onClick={insertLink}
          className="transform rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-orange-400"
        >
          🔗 Link
        </button>
      </div>
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-sm font-semibold text-transparent">
        400px Arial • Safelist Optimized
      </div>
    </div>
  );
}

export default function MultimillionaireEditor() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h2 className="mb-3 bg-gradient-to-r from-white via-purple-200 to-yellow-300 bg-clip-text text-4xl font-bold text-transparent">
            Premium Email Generator
          </h2>
          <p className="text-lg text-purple-200">
            Generate high-converting safelist emails using proven templates and
            world-class AI copywriting
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-800/80 via-purple-800/40 to-gray-800/80 shadow-2xl backdrop-blur-sm">
          <LexicalComposer initialConfig={initialConfig}>
            <PremiumToolbar />

            <div className="relative bg-gradient-to-br from-gray-900/90 via-purple-900/50 to-gray-800/90">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="min-h-[500px] p-8 leading-relaxed text-gray-100 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-inset"
                    style={{
                      maxWidth: '400px',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.7',
                    }}
                  />
                }
                placeholder={
                  <div className="pointer-events-none absolute top-8 left-8 text-purple-300">
                    <div className="mb-2 text-lg font-medium">
                      Start writing your million-dollar email...
                    </div>
                    <div className="text-sm text-purple-400">
                      Perfect 400px formatting for maximum safelist impact
                    </div>
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

          {/* Premium Action Buttons */}
          <div className="flex items-center justify-between border-t border-purple-500/30 bg-gradient-to-r from-gray-800/90 via-purple-800/90 to-gray-800/90 p-6 backdrop-blur-sm">
            <div className="flex space-x-4">
              <button className="transform rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-gray-500 hover:to-gray-600">
                💾 Save Draft
              </button>
              <button className="transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-purple-500">
                👁️ Preview
              </button>
            </div>
            <button className="transform rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-8 py-3 font-bold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400">
              🚀 Send to Safelists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
