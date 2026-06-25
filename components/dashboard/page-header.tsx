export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{label}</p>
        <Icon className="text-muted-foreground size-4" />
      </div>
      <p className="font-serif mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="text-muted-foreground mt-1 text-xs">{sub}</p>}
    </div>
  );
}
