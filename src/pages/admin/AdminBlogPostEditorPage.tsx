import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { api, type BlogPost, type BlogPostPayload } from "../../services/api";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { PAGE_TRANSITION } from "../../lib/motion";

type BlogPostForm = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  meta_title: string;
  meta_description: string;
  status: "draft" | "published";
  cover_image_signed_id: string | null;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function postToForm(post: BlogPost): BlogPostForm {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: post.body ?? "",
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
    status: post.status,
    cover_image_signed_id: null,
  };
}

const emptyForm: BlogPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "<p></p>",
  meta_title: "",
  meta_description: "",
  status: "draft",
  cover_image_signed_id: null,
};

export function AdminBlogPostEditorPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isNew = postId === "new" || !postId;
  const id = isNew ? null : Number(postId);

  const [form, setForm] = useState<BlogPostForm>(emptyForm);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew || !Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api.admin.blogPosts
      .show(id!)
      .then((post) => {
        setForm(postToForm(post));
        setCoverPreview(post.cover_image_url);
        setSlugTouched(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load post");
      })
      .finally(() => setLoading(false));
  }, [isNew, id]);

  const dirty = useMemo(() => form.title.trim().length > 0, [form.title]);

  function updateField<K extends keyof BlogPostForm>(key: K, value: BlogPostForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function onCoverSelect(file: File | null) {
    if (!file) return;
    setError(null);
    try {
      const signedId = await api.upload(file);
      setForm((prev) => ({ ...prev, cover_image_signed_id: signedId }));
      setCoverPreview(URL.createObjectURL(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover upload failed");
    }
  }

  function buildPayload(statusOverride?: BlogPostForm["status"]): BlogPostPayload {
    const payload: BlogPostPayload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || undefined,
      body: form.body,
      meta_title: form.meta_title.trim() || undefined,
      meta_description: form.meta_description.trim() || undefined,
      status: statusOverride ?? form.status,
    };
    if (form.cover_image_signed_id) {
      payload.cover_image_signed_id = form.cover_image_signed_id;
    }
    return payload;
  }

  async function save(statusOverride?: BlogPostForm["status"]) {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = buildPayload(statusOverride);
      if (isNew) {
        const created = await api.admin.blogPosts.create(payload);
        setMessage(statusOverride === "published" ? "Post published" : "Post created");
        navigate(`/admin/blog/${created.id}`, { replace: true });
      } else {
        const updated = await api.admin.blogPosts.update(id!, payload);
        setForm(postToForm(updated));
        setCoverPreview(updated.cover_image_url);
        setMessage(statusOverride === "published" ? "Post published" : "Post saved");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (isNew || !Number.isFinite(id)) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);
    try {
      await api.admin.blogPosts.destroy(id!);
      navigate("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void save();
  }

  if (loading) {
    return <p className="text-sm text-ch-text-secondary">Loading post…</p>;
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="space-y-6">
      <AdminPageHeader
        title={isNew ? "New post" : "Edit post"}
        subtitle={isNew ? "Create a draft or publish immediately." : `Editing /blog/${form.slug}`}
        breadcrumbs={[
          { label: "Overview", to: "/admin" },
          { label: "Blog", to: "/admin/blog" },
          { label: isNew ? "New" : form.title || "Edit" },
        ]}
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-ch-accent">{message}</p> : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div>
            <label htmlFor="post-title" className="mb-1 block text-sm text-ch-text-secondary">
              Title
            </label>
            <Input
              id="post-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Post title"
              required
            />
          </div>

          <div>
            <label htmlFor="post-slug" className="mb-1 block text-sm text-ch-text-secondary">
              Slug
            </label>
            <Input
              id="post-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField("slug", e.target.value);
              }}
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label htmlFor="post-excerpt" className="mb-1 block text-sm text-ch-text-secondary">
              Excerpt
            </label>
            <textarea
              id="post-excerpt"
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={2}
              placeholder="Short teaser for listings and SEO fallback"
              className="w-full rounded-xl border border-ch-border bg-ch-surface-elevated px-3 py-2 text-sm text-ch-text placeholder:text-ch-text-secondary focus:border-ch-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-ch-text-secondary">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as BlogPostForm["status"])}
              className="rounded-xl border border-ch-border bg-ch-surface-elevated px-3 py-2 text-sm text-ch-text focus:border-ch-primary focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-ch-text">Cover image</h2>
          {coverPreview ? (
            <img
              src={coverPreview}
              alt=""
              className="max-h-48 rounded-xl border border-ch-border object-cover"
            />
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void onCoverSelect(e.target.files?.[0] ?? null)}
          />
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            {coverPreview ? "Replace cover" : "Upload cover"}
          </Button>
        </Card>

        <div>
          <label className="mb-2 block text-sm text-ch-text-secondary">Body</label>
          <RichTextEditor value={form.body} onChange={(html) => updateField("body", html)} />
        </div>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-ch-text">SEO</h2>
          <div>
            <label htmlFor="meta-title" className="mb-1 block text-sm text-ch-text-secondary">
              Meta title
            </label>
            <Input
              id="meta-title"
              value={form.meta_title}
              onChange={(e) => updateField("meta_title", e.target.value)}
              placeholder="Optional override"
            />
          </div>
          <div>
            <label htmlFor="meta-description" className="mb-1 block text-sm text-ch-text-secondary">
              Meta description
            </label>
            <textarea
              id="meta-description"
              value={form.meta_description}
              onChange={(e) => updateField("meta_description", e.target.value)}
              rows={2}
              maxLength={160}
              placeholder="Up to 160 characters"
              className="w-full rounded-xl border border-ch-border bg-ch-surface-elevated px-3 py-2 text-sm text-ch-text placeholder:text-ch-text-secondary focus:border-ch-primary focus:outline-none"
            />
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="secondary" disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save draft"}
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={saving || !dirty}
            onClick={() => void save("published")}
          >
            {saving ? "Saving…" : "Publish"}
          </Button>
          {!isNew ? (
            <Button type="button" variant="secondary" disabled={deleting} onClick={() => void onDelete()}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          ) : null}
          <Link to="/admin/blog" className="text-sm text-ch-text-secondary hover:text-ch-primary">
            Cancel
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
