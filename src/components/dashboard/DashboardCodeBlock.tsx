
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const codeSnippets = [
  {
    language: 'JavaScript',
    code: `const greeting = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greeting('World'));`
  },
  {
    language: 'Python',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`
  },
  {
    language: 'CSS',
    code: `.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`
  },
  {
    language: 'HTML',
    code: `<div class="container">
  <h1>Welcome</h1>
  <p>This is a sample HTML structure.</p>
  <button onclick="handleClick()">Click me</button>
</div>`
  },
];

export function DashboardCodeBlock() {
  const [currentSnippet, setCurrentSnippet] = useState(codeSnippets[0]);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomSnippet = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * codeSnippets.length);
      setCurrentSnippet(codeSnippets[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          Code Snippet
          <Button 
            onClick={getRandomSnippet}
            size="sm"
            variant="ghost"
            className="ml-auto h-8 w-8 p-0"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-secondary px-2 py-1 rounded-md font-mono">
              {currentSnippet.language}
            </span>
            <Button
              onClick={copyCode}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="bg-background/80 rounded-md border border-border/50 p-3">
            <pre className="text-xs text-foreground overflow-auto">
              <code>{currentSnippet.code}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
