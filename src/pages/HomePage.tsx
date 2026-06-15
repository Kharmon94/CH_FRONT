import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { DURATION, EASE_CH, STAGGER_CONTAINER, STAGGER_ITEM } from "../lib/motion";

const features = [
  ["Link your state.db", "Point Cursor Help at your local Cursor database. Nothing uploads."],
  ["Search every chat", "Find the session you need — even across 10 GB of history."],
  ["Agent Clone export", "Bundle same-name sessions into one handoff file for a fresh agent."],
] as const;

export function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-12 text-center sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[min(100vw,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ch-primary/25 blur-3xl"
        />
        <motion.div
          className="relative pt-16 sm:pt-24 md:pt-28"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.hero, ease: EASE_CH }}
        >
          <h1
            className="text-4xl font-bold tracking-tight text-ch-text sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recover broken Cursor agents
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ch-text-secondary">
            Export full chat history or clone your agent into a fresh session — locally,
            privately, in one click.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/app">
              <Button>Open App</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section
        id="how-it-works"
        className="mt-12 grid gap-6 md:grid-cols-3"
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {features.map(([title, body]) => (
          <motion.div key={title} variants={STAGGER_ITEM}>
            <Card>
              <h3 className="text-lg font-semibold text-ch-primary">{title}</h3>
              <p className="mt-2 text-sm text-ch-text-secondary">{body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <section className="mt-16 rounded-3xl border border-ch-accent/30 bg-ch-accent/5 p-8">
        <h2 className="text-2xl font-semibold text-ch-accent" style={{ fontFamily: "var(--font-display)" }}>
          Agent Clone
        </h2>
        <p className="mt-3 max-w-3xl text-ch-text-secondary">
          Bundles every session sharing the same name into a structured handoff. Attach to a
          new Cursor Agent, paste the prompt, keep building.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ch-text-secondary">
          <li>Export Agent Clone from your primary session</li>
          <li>Open a fresh Cursor Agent chat</li>
          <li>Paste the Start here prompt and attach the file</li>
        </ol>
      </section>
    </main>
  );
}
