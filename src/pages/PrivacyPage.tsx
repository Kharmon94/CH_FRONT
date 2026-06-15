import { Card } from "../components/ui/Card";

export function PrivacyPage() {
  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Privacy
      </h1>
      <Card className="ch-rich-text mt-8 space-y-4 text-sm">
        <p>
          Cursor Help is local-first. Your Cursor database is read from a path you provide on
          your own machine. We do not upload your raw state.db to our servers.
        </p>
        <p>
          Export files are written to your local API storage directory. You control where your
          database lives and when to delete exports.
        </p>
        <p>
          Cursor Help is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.
        </p>
      </Card>
    </main>
  );
}
