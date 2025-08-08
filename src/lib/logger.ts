// Lightweight namespaced logger with opt-in debugging via localStorage
// Usage:
//   const log = createLogger('app');
//   log.debug('message'); log.info('...'); log.warn('...'); log.error('...');
// Enable logs in browser console:
//   localStorage.setItem('debug', 'app,security:*')
//   // or enable all:
//   localStorage.setItem('debug', '*')
// You can also toggle window.__DEBUG__ = true to enable all temporarily.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function getNamespaces(): string[] {
  try {
    // window.__DEBUG__ = true enables all
    if (typeof window !== 'undefined' && (window as any).__DEBUG__ === true) return ['*'];
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem('debug') || '';
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function nsEnabled(ns: string, namespaces: string[]): boolean {
  if (!namespaces.length) return false;
  if (namespaces.includes('*')) return true;
  return namespaces.some((n) => {
    if (n.endsWith('*')) return ns.startsWith(n.slice(0, -1));
    return n === ns;
  });
}

export function createLogger(namespace: string) {
  const base = `[${namespace}]`;
  const getEnabled = () => nsEnabled(namespace, getNamespaces());

  const logFactory = (level: LogLevel) =>
    (...args: any[]) => {
      if (!getEnabled()) return;
      const ts = new Date().toISOString();
      switch (level) {
        case 'debug':
          console.debug?.(base, ts, ...args);
          break;
        case 'info':
          console.info?.(base, ts, ...args);
          break;
        case 'warn':
          console.warn?.(base, ts, ...args);
          break;
        case 'error':
          console.error?.(base, ts, ...args);
          break;
      }
    };

  return {
    debug: logFactory('debug'),
    info: logFactory('info'),
    warn: logFactory('warn'),
    error: logFactory('error'),
  } as const;
}
