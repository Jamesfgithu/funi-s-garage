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
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, AutoLinkNode],
  onError: (error: Error) => console.error('Lexical Error:', error),
};

function EditorToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-600">
      <div className="flex items-center space-x-2">
        <button
          onClick={formatBold}
          className="px-3 py-1.5 bg-gray-700 hover:bg-yellow-500 hover:text-black text-white rounded transition-colors font-bold"
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="px-3 py-1.5 bg-gray-700 hover:bg-yellow-500 hover:text-black text-white rounded transition-colors italic"
        >
          I
        </button>
        <div className="w-px h-6 bg-gray-600 mx-2"></div>
        <button
          onClick={insertLink}
          className="px-3 py-1.5 bg-gray-700 hover:bg-yellow-500 hover:text-black text-white rounded transition-colors"
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
          <h2 className="text-xl font-bold text-white mb-2">Safelist AI Pro - Email Generator</h2>
          <p className="text-gray-400">Generate high-converting safelist emails using proven templates and world-class AI copywriting</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <LexicalComposer initialConfig={initialConfig}>
            <EditorToolbar />
            
            <div className="relative bg-gray-900">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable 
                    className="min-h-[400px] p-6 outline-none text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:ring-inset"
                    style={{ 
                      maxWidth: '400px', 
                      fontFamily: 'Arial, sans-serif', 
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                  />
                }
                placeholder={
                  <div className="absolute top-6 left-6 text-gray-500 pointer-events-none">
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
          <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                Preview
              </button>
            </div>
            <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded transition-colors">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
