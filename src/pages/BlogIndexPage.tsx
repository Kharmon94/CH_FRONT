import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { api, type BlogPostSummary } from "../services/api";
import { PageMeta } from "../components/seo/PageMeta";
import { JsonLd } from "../components/seo/JsonLd";
import { Card } from "../components/ui/Card";
import { absoluteUrl, siteUrl } from "../lib/siteUrl";
import { PAGE_TRANSITION } from "../lib/motion";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.blogPosts
      .list()
      .then(setPosts)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const origin = siteUrl();

  return (
    <motion.main {...PAGE_TRANSITION} className="py-8">
      <PageMeta
        title="Blog"
        description="Tips on Cursor chat export, Agent Clone handoffs, and recovering broken agent sessions — from the Cursor Help team."
        path="/blog"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Cursor Help Blog",
          description: "Articles on Cursor chat export, Agent Clone, and agent recovery.",
          url: absoluteUrl("/blog"),
          isPartOf: origin
            ? {
                "@type": "WebSite",
                name: "Cursor Help",
                url: origin,
              }
            : undefined,
        }}
      />

      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-ch-text-secondary">
        Guides on Cursor chat export, Agent Clone handoffs, and keeping context when an agent session
        breaks.
      </p>

      {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm text-ch-text-secondary">Loading posts…</p> : null}

      {!loading && posts.length === 0 ? (
        <p className="mt-8 text-sm text-ch-text-secondary">No posts yet. Check back soon.</p>
      ) : null}

      {!loading && posts.length > 0 ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <Card className="flex h-full flex-col overflow-hidden transition-colors group-hover:border-ch-primary/30">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="aspect-[2/1] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/1] w-full bg-gradient-to-br from-ch-primary/20 to-ch-accent/10" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {post.published_at ? (
                      <time
                        dateTime={post.published_at}
                        className="text-xs text-ch-text-secondary"
                      >
                        {formatDate(post.published_at)}
                      </time>
                    ) : null}
                    <h2 className="mt-2 text-lg font-semibold text-ch-text group-hover:text-ch-primary">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-ch-text-secondary">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-4 text-sm font-medium text-ch-primary">Read more →</span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.main>
  );
}
