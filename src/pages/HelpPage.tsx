import { Link } from "react-router-dom";
import { PageMeta } from "../components/seo/PageMeta";
import { JsonLd } from "../components/seo/JsonLd";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { HELP_FAQS } from "../lib/helpFaqs";

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
      <PageMeta
        title="Help & FAQ"
        description="Answers about Cursor chat export, linking your database, Agent Clone handoffs, Free vs Pro, billing, and Google sign-in."
        path="/help"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HELP_FAQS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Help & FAQ
      </h1>
      <p className="mt-4 max-w-2xl text-ch-text-secondary">
        Common questions about Cursor chat export, linking your database, Agent Clone, and billing.
      </p>

      <div className="mt-10 space-y-3">
        {HELP_FAQS.map((item) => (
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
