'use client';

import { useState } from 'react';
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
  link: 'text-premium hover:glow-text cursor-pointer transition-all',
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
    <div className="premium-toolbar p-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button onClick={formatBold} className="toolbar-btn font-bold">B</button>
        <button onClick={formatItalic} className="toolbar-btn italic">I</button>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        <button onClick={insertLink} className="toolbar-btn">🔗 Link</button>
      </div>
      <div className="text-premium text-sm font-semibold">
        400px Arial • Safelist Optimized
      </div>
    </div>
  );
}

export default function MultimillionaireInterface() {
  const [activeTab, setActiveTab] = useState('email-generator');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', subtitle: 'Overview & analytics' },
    { id: 'email-generator', label: 'Email Generator', icon: '⭐', subtitle: 'AI-powered creation' },
    { id: 'quick-generate', label: 'Quick Generate', icon: '⚡', subtitle: 'Instant templates' },
    { id: 'safelist-manager', label: 'Safelist Manager', icon: '🎯', subtitle: 'Ready indicators' },
    { id: 'template-library', label: 'Template Library', icon: '📚', subtitle: 'Proven frameworks' },
    { id: 'analytics', label: 'Analytics', icon: '📈', subtitle: 'Performance metrics' },
  ];

  return (
    <div className="flex h-screen">
      {/* PREMIUM SIDEBAR */}
      <div className="w-80 premium-sidebar">
        {/* Logo */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 btn-premium flex items-center justify-center animate-float">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <h1 className="text-premium text-2xl font-bold">Safelist AI Pro</h1>
              <p className="text-white/60 text-sm">Premium Edition</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full nav-item text-left ${
                item.id === activeTab ? 'active' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{item.label}</div>
                  <div className="text-sm opacity-70">{item.subtitle}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Premium Badge */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="btn-premium text-center p-4">
            <div className="font-bold text-lg">Premium Account</div>
            <div className="text-sm opacity-80">Unlimited Everything</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass-effect border-b border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-premium text-4xl font-bold mb-2 glow-text">
                Email Generator
              </h1>
              <p className="text-white/70 text-lg">
                Create high-converting safelist emails with world-class AI
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="btn-premium">🔔</button>
              <button className="btn-premium">👤</button>
            </div>
          </div>
        </header>

        {/* Editor */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="premium-editor rounded-2xl overflow-hidden">
              <LexicalComposer initialConfig={initialConfig}>
                <PremiumToolbar />
                
                <div className="relative p-8">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable 
                        className="min-h-[500px] outline-none text-white/90 leading-relaxed"
                        style={{ 
                          maxWidth: '400px', 
                          fontFamily: 'Arial, sans-serif', 
                          fontSize: '14px',
                          lineHeight: '1.7'
                        }}
                      />
                    }
                    placeholder={
                      <div className="absolute top-8 left-8 text-white/40 pointer-events-none">
                        <div className="text-xl font-semibold mb-2">Start writing your million-dollar email...</div>
                        <div className="text-sm">Perfect 400px formatting for maximum safelist impact</div>
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
              <div className="premium-toolbar p-6 flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="toolbar-btn">💾 Save Draft</button>
                  <button className="toolbar-btn">👁️ Preview</button>
                </div>
                <button className="btn-premium text-xl px-8 py-4">
                  🚀 Send to Safelists
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
