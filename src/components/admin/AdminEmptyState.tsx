export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-ch-border px-6 py-12 text-center">
      <p className="font-medium text-ch-text">{title}</p>
      {description ? <p className="mt-2 text-sm text-ch-text-secondary">{description}</p> : null}
    </div>
  );
}
