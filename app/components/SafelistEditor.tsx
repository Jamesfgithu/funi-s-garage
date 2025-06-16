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
import { LinkNode, AutoLinkNode } from '@lexical/link';
import EditorToolbar from './EditorToolbar';

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  link: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
  paragraph: 'mb-2',
};

const initialConfig = {
  namespace: 'SafelistEditor',
  theme,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError: (error: Error) => {
    console.error('Lexical Error:', error);
  },
};

export default function SafelistEditor() {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar />
        
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[400px] p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{ 
                  maxWidth: '400px', 
                  fontFamily: 'Arial, sans-serif', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                Start writing your safelist email...
                <br />
                <span className="text-xs">Try: Bold (Ctrl+B), Italic (Ctrl+I), Links</span>
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
      
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t">
        💡 This editor formats content perfectly for safelist emails (400px max-width, Arial 14px)
      </div>
    </div>
  );
}
