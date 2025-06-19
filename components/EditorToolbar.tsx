'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useState } from 'react';

export default function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="flex items-center gap-2 border-b bg-gray-50 p-3">
      <button
        onClick={formatBold}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
          isBold
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <strong>B</strong>
      </button>

      <button
        onClick={formatItalic}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
          isItalic
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <em>I</em>
      </button>

      <div className="mx-1 h-6 w-px bg-gray-300"></div>

      <button
        onClick={insertLink}
        className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        🔗 Link
      </button>

      <div className="ml-auto text-xs text-gray-500">
        400px Arial • Perfect for safelists
      </div>
    </div>
  );
}
