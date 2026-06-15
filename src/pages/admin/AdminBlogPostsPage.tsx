import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { api, type BlogPostSummary } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminListRow } from "../../components/admin/AdminListRow";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PAGE_TRANSITION } from "../../lib/motion";

type StatusFilter = "all" | "draft" | "published";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.admin.blogPosts
      .list()
      .then(setPosts)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((post) => post.status === filter);
  }, [posts, filter]);

  const filters: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader
          title="Blog"
          subtitle="Create and publish articles for cursorhelp.com/blog."
          breadcrumbs={[
            { label: "Overview", to: "/admin" },
            { label: "Blog" },
          ]}
        />
        <Link to="/admin/blog/new">
          <Button variant="primary">
            <Plus className="mr-2 inline h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === key
                ? "bg-ch-primary/15 text-ch-primary"
                : "text-ch-text-secondary hover:bg-ch-surface-elevated hover:text-ch-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-ch-text-secondary">Loading posts…</p> : null}

      {!loading && filtered.length === 0 ? (
        <AdminEmptyState
          title={filter === "all" ? "No posts yet" : `No ${filter} posts`}
          description="Create your first blog post to get started."
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <ul className="space-y-2">
          {filtered.map((post) => (
            <AdminListRow
              key={post.id}
              to={`/admin/blog/${post.id}`}
              meta={
                <Badge variant={post.status === "published" ? "primary" : "muted"}>
                  {post.status}
                </Badge>
              }
            >
              <p className="truncate font-medium">{post.title}</p>
              <p className="text-ch-text-secondary">
                /blog/{post.slug} · {formatDate(post.published_at)}
              </p>
            </AdminListRow>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
