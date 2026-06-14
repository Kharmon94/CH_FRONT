import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export function SettingsPage() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await api.authUpdateMe({ name: name.trim() });
      await refreshMe();
      setMessage("Profile updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setLoading(false);
    }
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const signedId = await api.upload(file);
      const res = await api.authUpdateMe({ avatar_signed_id: signedId });
      setAvatarPreview(res.user.avatar_url);
      await refreshMe();
      setMessage("Avatar updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload avatar");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  if (!user) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-zinc-400">{user.email}</p>

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card>
        <h2 className="text-lg font-semibold">Profile photo</h2>
        <div className="mt-4 flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt=""
              className="h-16 w-16 rounded-full border border-zinc-700 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-lg text-zinc-400">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <label className="cursor-pointer text-sm text-emerald-400 hover:text-emerald-300">
            Upload image
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Display name</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
