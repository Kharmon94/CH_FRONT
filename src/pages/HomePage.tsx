import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Recover broken Cursor agents
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Export full chat history or clone your agent into a fresh session — locally,
          privately, in one click.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/app">
            <Button>Open App</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="secondary">View Pricing</Button>
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          ["Link your state.db", "Point Cursor Help at your local Cursor database. Nothing uploads."],
          ["Search every chat", "Find the session you need — even across 10 GB of history."],
          ["Agent Clone export", "Bundle same-name sessions into one handoff file for a fresh agent."],
        ].map(([title, body]) => (
          <Card key={title}>
            <h3 className="text-lg font-semibold text-emerald-400">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{body}</p>
          </Card>
        ))}
      </section>

      <section className="mt-20 rounded-lg border border-violet-500/30 bg-violet-500/5 p-8">
        <h2 className="text-2xl font-semibold text-violet-300">Agent Clone</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Bundles every session sharing the same name into a structured handoff. Attach to a
          new Cursor Agent, paste the prompt, keep building.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>Export Agent Clone from your primary session</li>
          <li>Open a fresh Cursor Agent chat</li>
          <li>Paste the Start here prompt and attach the file</li>
        </ol>
      </section>
    </main>
  );
}
