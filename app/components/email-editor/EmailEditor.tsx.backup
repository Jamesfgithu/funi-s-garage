'use client'

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
import { FORMAT_TEXT_COMMAND, $getRoot, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Zap } from 'lucide-react';
import { generateEmail } from '@/lib/ai-generation';
import { useState } from 'react';

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
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, AutoLinkNode],
  onError: (error: Error) => console.error('Lexical Error:', error),
};

function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const generatedHtml = await generateEmail({ topic: 'safelist marketing' });
      
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        // Parse HTML string into DOM nodes
        const parser = new DOMParser();
        const dom = parser.parseFromString(generatedHtml, 'text/html');
        
        // Convert DOM nodes to Lexical nodes
        const nodes = $generateNodesFromDOM(editor, dom);
        
        // Append the nodes to the root
        root.append(...nodes);
      });
    } catch (error) {
      console.error('AI Generation error:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border-b border-border bg-muted/30 px-6 py-4">
      <div className="flex items-center gap-2">
        {/* AI Generation Button */}
        <Button
          onClick={handleGenerateEmail}
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Email'}
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={formatBold}
          className="hover:bg-accent"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          className="hover:bg-accent"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="hover:bg-accent"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="hover:bg-accent"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="hover:bg-accent"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function EmailEditor() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar />
        
        {/* WHITE EDITOR AREA */}
        <div className="min-h-[500px] bg-white">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[500px] p-6 outline-none text-black focus:ring-2 focus:ring-primary focus:ring-inset"
                style={{ 
                  maxWidth: '400px', 
                  fontFamily: 'Arial, sans-serif', 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
                Click "Generate Email" to create AI-powered safelist content...
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
      
      {/* Professional Action Buttons */}
      <div className="border-t border-border bg-muted/30 px-6 py-6">
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="min-w-[140px] h-12 font-medium"
          >
            Save Draft
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="min-w-[140px] h-12 font-medium"
          >
            Preview
          </Button>
          
          <Button 
            size="lg"
            className="min-w-[140px] h-12 font-medium bg-primary hover:bg-primary/90"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  )
}
