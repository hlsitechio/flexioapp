import { TimeDisplay } from '@/components/top-navigation/TimeDisplay';

interface PageTitleBarProps {
  title: string;
}

export function PageTitleBar({ title }: PageTitleBarProps) {
  return (
    <div className="bg-black text-white px-6 py-4 w-full flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      <TimeDisplay />
    </div>
  );
}