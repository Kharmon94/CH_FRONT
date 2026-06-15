import { Link } from "react-router-dom";
import { PageMeta } from "../components/seo/PageMeta";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const useCases = [
  {
    title: "Dead agent session",
    body: "Your Cursor agent stopped responding mid-task. Export the full thread or Agent Clone into a fresh chat without re-explaining the project.",
  },
  {
    title: "Lost context across sessions",
    body: "Same feature name, multiple composer tabs. Agent Clone merges same-name sessions so the next agent sees the full story.",
  },
  {
    title: "Massive chat history",
    body: "10 GB of local Cursor data and no way to find yesterday's debugging session. Search every composer and export what you need.",
  },
];

export function AboutPage() {
  return (
    <main className="py-8">
      <PageMeta
        title="About"
        description="Cursor Help helps developers recover broken Cursor agent sessions with local-first chat export, search, and Agent Clone handoffs."
        path="/about"
      />

      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        About Cursor Help
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ch-text-secondary">
        Cursor Help is for developers who depend on Cursor agents and need a reliable way to export
        chat history, search composer sessions, and hand off context when something breaks.
      </p>

      <div className="mt-10 space-y-6">
        <Card className="space-y-3 text-sm text-ch-text-secondary">
          <h2 className="text-lg font-semibold text-ch-text">Who it&apos;s for</h2>
          <p>
            Solo developers and teams using Cursor Composer daily — especially when agents lose
            context, sessions stall, or you need to archive and share a long debugging thread.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {useCases.map((item) => (
            <Card key={item.title} className="space-y-2 text-sm text-ch-text-secondary">
              <h3 className="font-semibold text-ch-text">{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>

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
        <Link to="/download">
          <Button>Download desktop app</Button>
        </Link>
        <Link to="/app/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
        <Link to="/help">
          <Button variant="secondary">Help & FAQ</Button>
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-ch-text-secondary">
        The website is your account portal (billing, teams, settings). Search and export run in the
        desktop app on your machine.
      </p>
    </main>
  );
}
