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
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, AutoLinkNode],
  onError: (error: Error) => console.error('Lexical Error:', error),
};

function PremiumToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/90 via-purple-800/90 to-gray-800/90 backdrop-blur-sm border-b border-purple-500/30">
      <div className="flex items-center space-x-3">
        <button
          onClick={formatBold}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 italic shadow-lg"
        >
          I
        </button>
        <div className="w-px h-8 bg-gradient-to-b from-purple-500 to-pink-500 mx-3"></div>
        <button
          onClick={insertLink}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🔗 Link
        </button>
      </div>
      <div className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
        400px Arial • Safelist Optimized
      </div>
    </div>
  );
}

export default function MultimillionaireEditor() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-yellow-300 bg-clip-text text-transparent mb-3">
            Premium Email Generator
          </h2>
          <p className="text-purple-200 text-lg">
            Generate high-converting safelist emails using proven templates and world-class AI copywriting
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 via-purple-800/40 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl">
          <LexicalComposer initialConfig={initialConfig}>
            <PremiumToolbar />
            
            <div className="relative bg-gradient-to-br from-gray-900/90 via-purple-900/50 to-gray-800/90">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable 
                    className="min-h-[500px] p-8 outline-none text-gray-100 focus:ring-2 focus:ring-yellow-500/50 focus:ring-inset leading-relaxed"
                    style={{ 
                      maxWidth: '400px', 
                      fontFamily: 'Arial, sans-serif', 
                      fontSize: '14px',
                      lineHeight: '1.7'
                    }}
                  />
                }
                placeholder={
                  <div className="absolute top-8 left-8 text-purple-300 pointer-events-none">
                    <div className="text-lg font-medium mb-2">Start writing your million-dollar email...</div>
                    <div className="text-sm text-purple-400">Perfect 400px formatting for maximum safelist impact</div>
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
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/90 via-purple-800/90 to-gray-800/90 backdrop-blur-sm border-t border-purple-500/30">
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                💾 Save Draft
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                👁️ Preview
              </button>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
              🚀 Send to Safelists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
