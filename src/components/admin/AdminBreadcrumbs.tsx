import { Link } from "react-router-dom";

export type AdminBreadcrumbItem = {
  label: string;
  to?: string;
};

export function AdminBreadcrumbs({ items }: { items: AdminBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ch-text-secondary">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 ? <span className="mx-2 text-ch-border">→</span> : null}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-ch-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-ch-text">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
