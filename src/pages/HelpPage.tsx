import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What is Cursor Help?",
    answer:
      "Cursor Help reads your local Cursor database, indexes your composer sessions, and lets you search, export markdown, or generate Agent Clone handoff files so you can continue in a fresh agent chat.",
  },
  {
    question: "Does Cursor Help upload my database?",
    answer:
      "No. Your Cursor database stays on your machine. Cursor Help reads it locally via the API you run (or our hosted app pointing at your linked path). We do not upload raw chat databases to our servers.",
  },
  {
    question: "How do I link my database?",
    answer:
      "Sign in, open the app dashboard, and paste the path to your Cursor database (or use the file picker if available). The API indexes composers in the background — refresh the dashboard to see status.",
  },
  {
    question: "What is Agent Clone?",
    answer:
      "Agent Clone bundles every session sharing the same composer name into one structured export. Attach it to a new Cursor Agent, paste the included prompt, and pick up where you left off. Pro only.",
  },
  {
    question: "What's included on Free vs Pro?",
    answer:
      "Free: browse and search all chats, one markdown export. Pro: unlimited markdown exports, Agent Clone, batch export, and full export history re-downloads. See Pricing for details.",
  },
  {
    question: "Is Cursor Help affiliated with Cursor?",
    answer:
      "No. Cursor Help is an independent tool and is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.",
  },
  {
    question: "Google sign-in fails or OAuth errors",
    answer:
      "Make sure the API is running and reachable, and that Google OAuth env vars are set on the API service. If you see a server error on sign-in, contact us with the time of the attempt.",
  },
  {
    question: "How do I cancel Pro?",
    answer:
      "Open Billing in the app (team owner) and use the Stripe customer portal to manage or cancel your subscription. Your team reverts to Free at the end of the billing period.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-ch-border bg-ch-surface/50 open:bg-ch-surface-elevated/30">
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-ch-text marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-4">
          {question}
          <span className="shrink-0 text-ch-text-secondary transition group-open:rotate-45">+</span>
        </span>
      </summary>
      <p className="border-t border-ch-border px-5 pb-4 pt-3 text-sm leading-relaxed text-ch-text-secondary">
        {answer}
      </p>
    </details>
  );
}

export function HelpPage() {
  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Help & FAQ
      </h1>
      <p className="mt-4 max-w-2xl text-ch-text-secondary">
        Common questions about linking your database, exports, billing, and Agent Clone.
      </p>

      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <FaqItem key={item.question} {...item} />
        ))}
      </div>

      <Card className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-ch-text">Still stuck?</h2>
        <p className="text-sm text-ch-text-secondary">
          We are happy to help with setup, billing, or export issues.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact">
            <Button variant="primary">Contact us</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="secondary">View Pricing</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
