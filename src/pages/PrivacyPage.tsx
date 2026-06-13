import { Card } from "../components/ui/Card";

export function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Privacy</h1>
      <Card className="mt-8 space-y-4 text-sm text-zinc-300">
        <p>
          Cursor Help is local-first. Your Cursor database is read from a path you provide on
          your own machine. We do not upload your raw state.db to our servers.
        </p>
        <p>
          Export files are written to your local API storage directory. You control where your
          database lives and when to delete exports.
        </p>
        <p className="text-zinc-500">
          Cursor Help is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.
        </p>
      </Card>
    </main>
  );
}
