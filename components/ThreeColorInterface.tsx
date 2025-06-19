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
  namespace: 'ThreeColorEditor',
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
    <div className="premium-toolbar flex items-center justify-between p-8">
      <div className="flex items-center space-x-4">
        <button onClick={formatBold} className="toolbar-btn text-lg font-bold">
          B
        </button>
        <button onClick={formatItalic} className="toolbar-btn text-lg italic">
          I
        </button>
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
        <button onClick={insertLink} className="toolbar-btn">
          🔗 Link
        </button>
      </div>
      <div className="text-premium glow-text text-lg font-bold">
        400px Arial • Safelist Optimized
      </div>
    </div>
  );
}

export default function ThreeColorInterface() {
  const [activeTab, setActiveTab] = useState('email-generator');

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      subtitle: 'Overview & analytics',
    },
    {
      id: 'email-generator',
      label: 'Email Generator',
      icon: '⭐',
      subtitle: 'AI-powered creation',
    },
    {
      id: 'quick-generate',
      label: 'Quick Generate',
      icon: '⚡',
      subtitle: 'Instant templates',
    },
    {
      id: 'safelist-manager',
      label: 'Safelist Manager',
      icon: '🎯',
      subtitle: 'Ready indicators',
    },
    {
      id: 'template-library',
      label: 'Template Library',
      icon: '📚',
      subtitle: 'Proven frameworks',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      subtitle: 'Performance metrics',
    },
  ];

  return (
    <div className="animate-gradient flex h-screen">
      {/* PREMIUM THREE-COLOR SIDEBAR */}
      <div className="premium-sidebar w-80">
        {/* Logo */}
        <div className="border-b border-white/20 p-8">
          <div className="flex items-center space-x-4">
            <div className="btn-premium flex h-14 w-14 items-center justify-center">
              <span className="text-3xl">⭐</span>
            </div>
            <div>
              <h1 className="text-premium glow-text text-3xl font-bold">
                Safelist AI Pro
              </h1>
              <p className="text-lg font-semibold text-white/70">
                Premium Edition
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 p-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item w-full text-left ${
                item.id === activeTab ? 'active' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-xl font-bold">{item.label}</div>
                  <div className="text-lg opacity-80">{item.subtitle}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Premium Badge */}
        <div className="absolute right-6 bottom-8 left-6">
          <div className="btn-premium p-6 text-center">
            <div className="text-xl font-bold">Premium Account</div>
            <div className="text-lg opacity-90">Unlimited Everything</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="glass-effect border-b border-white/20 p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-premium glow-text mb-3 text-5xl font-bold">
                Email Generator
              </h1>
              <p className="text-xl font-semibold text-white/80">
                Create high-converting safelist emails with world-class AI
              </p>
            </div>
            <div className="flex space-x-6">
              <button className="btn-premium p-4 text-2xl">🔔</button>
              <button className="btn-premium p-4 text-2xl">👤</button>
            </div>
          </div>
        </header>

        {/* Editor */}
        <main className="flex-1 overflow-auto p-10">
          <div className="mx-auto max-w-6xl">
            <div className="premium-card">
              <LexicalComposer initialConfig={initialConfig}>
                <PremiumToolbar />

                <div className="relative p-10">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="min-h-[600px] text-lg leading-relaxed text-white/95 outline-none"
                        style={{
                          maxWidth: '400px',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '1.8',
                        }}
                      />
                    }
                    placeholder={
                      <div className="pointer-events-none absolute top-10 left-10 text-white/50">
                        <div className="text-premium glow-text mb-3 text-2xl font-bold">
                          Start writing your million-dollar email...
                        </div>
                        <div className="text-lg">
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

              {/* Action Buttons */}
              <div className="premium-toolbar flex items-center justify-between p-8">
                <div className="flex space-x-6">
                  <button className="toolbar-btn text-lg">💾 Save Draft</button>
                  <button className="toolbar-btn text-lg">👁️ Preview</button>
                </div>
                <button className="btn-premium px-12 py-6 text-2xl font-bold">
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
