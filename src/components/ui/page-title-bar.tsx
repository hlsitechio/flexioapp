interface PageTitleBarProps {
  title: string;
}

export function PageTitleBar({ title }: PageTitleBarProps) {
  return (
    <div className="bg-black text-white px-6 py-4 w-full">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}