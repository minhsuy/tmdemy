"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  RotateCcw, 
  Download, 
  Upload, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Code2
} from "lucide-react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  readOnly?: boolean;
  height?: string;
  showToolbar?: boolean;
  testResults?: Array<{
    testCase: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  }>;
  isRunning?: boolean;
  executionTime?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  onRun,
  onReset,
  readOnly = false,
  height = "400px",
  showToolbar = true,
  testResults = [],
  isRunning = false,
  executionTime = 0,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);

  // Language configurations
  const languageConfigs = {
    javascript: {
      name: "JavaScript",
      extension: ".js",
      comment: "//",
      keywords: ["function", "const", "let", "var", "if", "else", "for", "while", "return"],
    },
    python: {
      name: "Python",
      extension: ".py",
      comment: "#",
      keywords: ["def", "class", "if", "else", "for", "while", "return", "import"],
    },
    java: {
      name: "Java",
      extension: ".java",
      comment: "//",
      keywords: ["public", "class", "static", "void", "main", "if", "else", "for", "while"],
    },
    cpp: {
      name: "C++",
      extension: ".cpp",
      comment: "//",
      keywords: ["#include", "int", "main", "if", "else", "for", "while", "return"],
    },
  };

  const currentConfig = languageConfigs[language as keyof typeof languageConfigs] || languageConfigs.javascript;

  // Enhanced syntax highlighting
  const highlightCode = (code: string) => {
    if (!currentConfig) return code;

    let highlighted = code;

    // Highlight keywords with better contrast
    currentConfig.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-blue-400 font-semibold">${keyword}</span>`);
    });

    // Highlight strings with better colors
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-green-300">"$1"</span>');
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-300">\'$1\'</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-purple-300">$1</span>');

    // Highlight comments with better visibility
    const commentRegex = new RegExp(`(${currentConfig.comment}.*$)`, 'gm');
    highlighted = highlighted.replace(commentRegex, '<span class="text-slate-400 italic">$1</span>');

    // Highlight function names
    highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-yellow-300">$1</span>(');

    // Highlight operators
    highlighted = highlighted.replace(/([+\-*/=<>!&|])/g, '<span class="text-orange-300">$1</span>');

    return highlighted;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + ' '.repeat(tabSize) + value.substring(end);
      onChange(newValue);
      
      // Set cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + tabSize;
      }, 0);
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className={`bg-slate-900 text-slate-100 rounded-lg border border-slate-600 shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {showToolbar && (
        <div className="flex items-center justify-between p-3 border-b border-slate-600 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{currentConfig.name}</span>
              <Badge variant="outline" className="text-xs">
                {currentConfig.extension}
              </Badge>
            </div>
            
            {testResults.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Tests:</span>
                <span className="text-green-400">
                  {testResults.filter(r => r.passed).length}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-300">
                  {testResults.length}
                </span>
              </div>
            )}
            
            {executionTime > 0 && (
              <div className="flex items-center gap-1 text-sm text-yellow-400">
                <Clock className="w-3 h-3" />
                {formatTime(executionTime)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-300">Font:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-slate-700 border border-slate-500 rounded px-2 py-1 text-xs text-slate-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-slate-500 hover:bg-slate-700 text-slate-200"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {onReset && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
                className="border-slate-500 hover:bg-slate-700 text-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}

            {onRun && (
              <Button
                size="sm"
                onClick={onRun}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunning ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning ? "Running..." : "Run"}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex" style={{ height }}>
        {/* Line numbers */}
        <div className="w-12 bg-slate-800 border-r border-slate-600 flex flex-col text-xs text-slate-400 select-none flex-shrink-0 overflow-hidden">
          {value.split('\n').map((_, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center font-mono"
              style={{ 
                height: `${fontSize * 1.6}px`,
                minHeight: `${fontSize * 1.6}px`
              }}
            >
              {index + 1}
            </div>
          ))}
          {/* Add empty lines if needed */}
          {value.split('\n').length < 10 && Array.from({ length: 10 - value.split('\n').length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="flex items-center justify-center font-mono"
              style={{ 
                height: `${fontSize * 1.6}px`,
                minHeight: `${fontSize * 1.6}px`
              }}
            >
              {value.split('\n').length + index + 1}
            </div>
          ))}
        </div>
        
        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          placeholder={`// Write your ${currentConfig.name} code here...`}
          className={`flex-1 bg-transparent text-slate-100 font-mono resize-none focus:outline-none focus:ring-0 ${
            readOnly ? 'cursor-not-allowed opacity-75' : 'focus:bg-slate-800/50'
          }`}
          style={{
            height,
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            tabSize: tabSize,
            padding: '16px',
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="border-t border-slate-600 bg-slate-800">
          <div className="p-4">
            <h4 className="text-sm font-medium mb-3 text-slate-200">Test Results</h4>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3 text-sm p-2 rounded bg-slate-700/50">
                  {result.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="text-slate-200 font-medium">
                      Test {result.testCase}: 
                    </span>
                    <span className={`ml-2 font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    {result.error && (
                      <div className="text-red-400 text-xs mt-1 font-mono">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
