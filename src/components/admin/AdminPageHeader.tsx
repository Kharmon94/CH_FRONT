import { AdminBreadcrumbs, type AdminBreadcrumbItem } from "./AdminBreadcrumbs";

export function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: AdminBreadcrumbItem[];
}) {
  return (
    <div className="space-y-2">
      {breadcrumbs && breadcrumbs.length > 0 ? <AdminBreadcrumbs items={breadcrumbs} /> : null}
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle ? <p className="text-sm text-ch-text-secondary">{subtitle}</p> : null}
    </div>
  );
}
