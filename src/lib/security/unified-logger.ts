// Unified Security Logger - Consolidates all security messages
export interface SecurityMessage {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'initialization' | 'csp' | 'gdpr' | 'monitoring' | 'audit' | 'devtools';
  message: string;
  metadata?: Record<string, any>;
}

class UnifiedSecurityLogger {
  private messages: SecurityMessage[] = [];
  private maxMessages = 1000;
  private listeners: Array<(message: SecurityMessage) => void> = [];

  constructor() {
    // Override console methods to capture security-related logs
    this.interceptConsoleLogs();
  }

  private interceptConsoleLogs() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (this.isSecurityMessage(message)) {
        this.addMessage({
          level: 'info',
          category: this.categorizeMessage(message),
          message,
          metadata: { args }
        });
      }
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (this.isSecurityMessage(message)) {
        this.addMessage({
          level: 'warn',
          category: this.categorizeMessage(message),
          message,
          metadata: { args }
        });
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (this.isSecurityMessage(message)) {
        this.addMessage({
          level: 'error',
          category: this.categorizeMessage(message),
          message,
          metadata: { args }
        });
      }
      originalError.apply(console, args);
    };
  }

  private isSecurityMessage(message: string): boolean {
    const securityKeywords = [
      '🔒', '🔍', '🛠️', '✅', '❌', '⚠️',
      'security', 'csp', 'gdpr', 'violation', 'monitoring',
      'devtools', 'audit', 'compliance', 'privacy',
      'Loading security', 'Security Suite', 'CSP', 'GDPR'
    ];
    
    return securityKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase()) ||
      message.includes(keyword)
    );
  }

  private categorizeMessage(message: string): SecurityMessage['category'] {
    if (message.includes('Loading security') || message.includes('Security Suite') || message.includes('Initialize')) {
      return 'initialization';
    }
    if (message.includes('CSP') || message.includes('violation')) {
      return 'csp';
    }
    if (message.includes('GDPR') || message.includes('privacy') || message.includes('consent')) {
      return 'gdpr';
    }
    if (message.includes('DevTools') || message.includes('🛠️')) {
      return 'devtools';
    }
    if (message.includes('audit') || message.includes('check')) {
      return 'audit';
    }
    return 'monitoring';
  }

  public addMessage(params: Omit<SecurityMessage, 'id' | 'timestamp'>) {
    const message: SecurityMessage = {
      id: this.generateId(),
      timestamp: new Date(),
      ...params
    };

    this.messages.push(message);
    
    // Keep only the most recent messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(message));
  }

  public getMessages(filter?: {
    level?: SecurityMessage['level'];
    category?: SecurityMessage['category'];
    since?: Date;
  }): SecurityMessage[] {
    let filtered = [...this.messages];

    if (filter?.level) {
      filtered = filtered.filter(m => m.level === filter.level);
    }
    if (filter?.category) {
      filtered = filtered.filter(m => m.category === filter.category);
    }
    if (filter?.since) {
      filtered = filtered.filter(m => m.timestamp >= filter.since!);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getMessagesByCategory(): Record<SecurityMessage['category'], SecurityMessage[]> {
    const categories: SecurityMessage['category'][] = ['initialization', 'csp', 'gdpr', 'monitoring', 'audit', 'devtools'];
    const result: Record<SecurityMessage['category'], SecurityMessage[]> = {} as any;

    categories.forEach(category => {
      result[category] = this.getMessages({ category });
    });

    return result;
  }

  public clearMessages() {
    this.messages = [];
  }

  public onMessage(listener: (message: SecurityMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public exportMessages(): string {
    return JSON.stringify(this.messages, null, 2);
  }

  public getSummary() {
    const total = this.messages.length;
    const byLevel = this.messages.reduce((acc, msg) => {
      acc[msg.level] = (acc[msg.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byCategory = this.messages.reduce((acc, msg) => {
      acc[msg.category] = (acc[msg.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = this.messages.filter(msg => 
      Date.now() - msg.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    ).length;

    return {
      total,
      recent,
      byLevel,
      byCategory,
      oldestMessage: this.messages[0]?.timestamp,
      newestMessage: this.messages[this.messages.length - 1]?.timestamp
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Create singleton instance
export const securityLogger = new UnifiedSecurityLogger();

// Enhanced logging functions for different security components
export const securityLog = {
  info: (category: SecurityMessage['category'], message: string, metadata?: Record<string, any>) => {
    securityLogger.addMessage({ level: 'info', category, message, metadata });
  },
  warn: (category: SecurityMessage['category'], message: string, metadata?: Record<string, any>) => {
    securityLogger.addMessage({ level: 'warn', category, message, metadata });
  },
  error: (category: SecurityMessage['category'], message: string, metadata?: Record<string, any>) => {
    securityLogger.addMessage({ level: 'error', category, message, metadata });
  },
  debug: (category: SecurityMessage['category'], message: string, metadata?: Record<string, any>) => {
    securityLogger.addMessage({ level: 'debug', category, message, metadata });
  }
};
