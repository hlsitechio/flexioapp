interface PageTitleBarProps {
  title: string;
  description?: string;
}

export function PageTitleBar({ title, description }: PageTitleBarProps) {
  return (
    <div className="bg-black text-white px-6 py-4 border-b w-full">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description && (
        <p className="text-white/70 text-sm mt-1">{description}</p>
      )}
    </div>
  );
}