import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language = 'python', readOnly = false }: CodeEditorProps) {
  return (
    <div className="w-full h-[400px] rounded-b-lg overflow-hidden" data-testid="code-editor">
      <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
        }}
      />
    </div>
  );
}
