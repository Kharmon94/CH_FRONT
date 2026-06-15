import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { api, ApiError, type BlogPost } from "../services/api";
import { PageMeta } from "../components/seo/PageMeta";
import { JsonLd } from "../components/seo/JsonLd";
import { Button } from "../components/ui/Button";
import { absoluteUrl } from "../lib/siteUrl";
import { PAGE_TRANSITION } from "../lib/motion";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    api.blogPosts
      .show(slug)
      .then(setPost)
      .catch((err) => {
        setPost(null);
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="py-8">
        <p className="text-sm text-ch-text-secondary">Loading…</p>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="py-8 text-center">
        <PageMeta
          title="Post not found"
          description="This blog post could not be found."
          path={`/blog/${slug ?? ""}`}
          noIndex
        />
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-sm text-ch-text-secondary">
          The article you are looking for may have been removed or is not published yet.
        </p>
        <Link to="/blog" className="mt-6 inline-block">
          <Button variant="secondary">Back to blog</Button>
        </Link>
      </main>
    );
  }

  const metaTitle = post.meta_title?.trim() || post.title;
  const metaDescription =
    post.meta_description?.trim() ||
    post.excerpt?.trim() ||
    `Read ${post.title} on the Cursor Help blog.`;
  const authorName = post.author.name?.trim() || post.author.email;

  return (
    <motion.article {...PAGE_TRANSITION} className="py-8">
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.cover_image_url}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: metaDescription,
          datePublished: post.published_at ?? post.created_at,
          dateModified: post.updated_at,
          author: {
            "@type": "Person",
            name: authorName,
          },
          image: post.cover_image_url ?? undefined,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />

      <Link
        to="/blog"
        className="text-sm text-ch-text-secondary transition hover:text-ch-primary"
      >
        ← Back to blog
      </Link>

      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt=""
          className="mt-6 aspect-[2/1] w-full rounded-3xl object-cover"
        />
      ) : null}

      <header className="mt-8">
        {post.published_at ? (
          <time dateTime={post.published_at} className="text-sm text-ch-text-secondary">
            {formatDate(post.published_at)}
          </time>
        ) : null}
        <h1
          className="mt-2 text-4xl font-bold tracking-tight text-ch-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg text-ch-text-secondary">{post.excerpt}</p>
        ) : null}
        <p className="mt-4 text-sm text-ch-text-secondary">By {authorName}</p>
      </header>

      <div
        className="ch-rich-text mt-10"
        dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
      />
    </motion.article>
  );
}
