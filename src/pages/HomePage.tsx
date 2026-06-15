import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageMeta } from "../components/seo/PageMeta";
import { JsonLd } from "../components/seo/JsonLd";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { siteUrl } from "../lib/siteUrl";
import { DURATION, EASE_CH, STAGGER_CONTAINER, STAGGER_ITEM } from "../lib/motion";

const features = [
  [
    "Link your Cursor database",
    "Point Cursor Help at your local Cursor database. Your chats never leave your machine.",
  ],
  [
    "Search every chat",
    "Find the session you need — even across 10 GB of Cursor chat history.",
  ],
  [
    "Agent Clone export",
    "Bundle same-name sessions into one handoff file and continue in a fresh Cursor agent.",
  ],
] as const;

export function HomePage() {
  const origin = siteUrl();

  return (
    <main>
      <PageMeta
        description="Local-first Cursor chat export and Agent Clone handoffs. Search every composer session and recover broken agents without uploading your database."
        path="/"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Cursor Help",
            url: origin || undefined,
            description:
              "Local-first Cursor chat export, search, and Agent Clone handoffs for developers.",
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Cursor Help",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Windows, macOS, Linux",
            url: origin || undefined,
            description:
              "Export Cursor chat history, search composer sessions, and generate Agent Clone handoff files locally.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
        ]}
      />

      <section className="relative overflow-hidden pb-12 text-center sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ch-text/[0.04] blur-3xl dark:bg-white/[0.06]"
        />
        <motion.div
          className="relative pt-16 sm:pt-24 md:pt-28"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.hero, ease: EASE_CH }}
        >
          <p className="text-sm font-medium text-ch-text-secondary">
            Built for developers who hit agent dead-ends
          </p>
          <h1
            className="mt-3 text-4xl font-bold tracking-tight text-ch-text sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cursor chat export &amp; Agent Clone recovery
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ch-text-secondary">
            Search every composer session, export full chat history, and clone a broken agent into a
            fresh session — locally, privately, in one click. Install the desktop app to link your database.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/download">
              <Button>Download for your OS</Button>
            </Link>
            <Link to="/app/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ch-text-secondary">
            Install the desktop app to link your Cursor database — search and export stay on your machine.
          </p>
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
              <h3 className="text-lg font-semibold text-ch-text">{title}</h3>
              <p className="mt-2 text-sm text-ch-text-secondary">{body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <section className="mt-16 rounded-xl border border-ch-border bg-ch-surface-elevated/50 p-8">
        <h2 className="text-2xl font-semibold text-ch-text" style={{ fontFamily: "var(--font-display)" }}>
          Agent Clone
        </h2>
        <p className="mt-3 max-w-3xl text-ch-text-secondary">
          When a Cursor agent session breaks, Agent Clone bundles every session sharing the same name
          into a structured handoff. Attach to a new agent, paste the prompt, and keep building.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ch-text-secondary">
          <li>Export Agent Clone from your primary session</li>
          <li>Open a fresh Cursor Agent chat</li>
          <li>Paste the Start here prompt and attach the file</li>
        </ol>
        <Link to="/help" className="mt-6 inline-block text-sm font-medium text-ch-accent hover:underline">
          Learn more in Help &amp; FAQ →
        </Link>
      </section>
    </main>
  );
}
