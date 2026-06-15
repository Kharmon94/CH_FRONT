import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function AboutPage() {
  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        About Cursor Help
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ch-text-secondary">
        Cursor Help helps you recover broken Cursor agent sessions — export full chat history or
        clone an agent into a fresh session, locally and privately.
      </p>

      <div className="mt-10 space-y-6">
        <Card className="space-y-3 text-sm text-ch-text-secondary">
          <h2 className="text-lg font-semibold text-ch-text">What we do</h2>
          <p>
            Point Cursor Help at your local Cursor <code className="text-ch-primary">state.db</code>.
            We index composers on your machine, let you search every chat, and export markdown or
            Agent Clone handoff files — without uploading your database to our servers.
          </p>
        </Card>

        <Card className="space-y-3 text-sm text-ch-text-secondary">
          <h2 className="text-lg font-semibold text-ch-text">Local-first by design</h2>
          <p>
            Your Cursor database stays on your computer. Exports are written to local storage you
            control. Cloud features (accounts, billing, team workspaces) sync metadata only — not
            your raw chat database.
          </p>
        </Card>

        <Card className="space-y-3 text-sm text-ch-text-secondary">
          <h2 className="text-lg font-semibold text-ch-text">Independent project</h2>
          <p>
            Cursor Help is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.
            We built it for developers who hit agent dead-ends and need a fast way to salvage context.
          </p>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/app">
          <Button>Open App</Button>
        </Link>
        <Link to="/help">
          <Button variant="secondary">Help & FAQ</Button>
        </Link>
        <Link to="/contact">
          <Button variant="secondary">Contact us</Button>
        </Link>
      </div>
    </main>
  );
}
