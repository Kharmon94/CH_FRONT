import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const rows = [
  ["Browse + search all chats", "Yes", "Yes"],
  ["Chat exports (markdown)", "1 chat", "Unlimited"],
  ["Agent Clone export", "No", "Yes"],
  ["Multi-select / batch export", "No", "Yes"],
  ["Export history", "Re-download 1", "Unlimited"],
];

export function PricingPage() {
  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Pricing
      </h1>
      <p className="mt-4 text-ch-text-secondary">
        Free to browse. Pro unlocks Agent Clone and unlimited exports.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-3xl font-bold">$0</p>
          <p className="mt-4 text-sm text-ch-text-secondary">Browse everything. Export one chat.</p>
        </Card>
        <Card className="border-ch-primary/40">
          <h2 className="text-xl font-semibold text-ch-primary">Pro</h2>
          <p className="mt-2 text-3xl font-bold">
            $7<span className="text-lg text-ch-text-secondary">/mo</span>
          </p>
          <p className="text-sm text-ch-text-secondary">or $50/year</p>
          <p className="mt-4 text-sm text-ch-accent">Includes Agent Clone — our flagship feature.</p>
          <Link to="/app/billing" className="mt-6 inline-block">
            <Button variant="primary">Upgrade in app</Button>
          </Link>
          <p className="mt-2 text-xs text-ch-text-secondary">Run locally via bin/dev to upgrade and export.</p>
        </Card>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-ch-border">
        <table className="min-w-full text-sm">
          <thead className="bg-ch-surface-elevated text-ch-text-secondary">
            <tr>
              <th className="px-4 py-3 text-left">Feature</th>
              <th className="px-4 py-3 text-left">Free</th>
              <th className="px-4 py-3 text-left">Pro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feature, free, pro]) => (
              <tr key={feature} className="border-t border-ch-border">
                <td className={`px-4 py-3 ${feature.includes("Agent Clone") ? "text-ch-accent" : ""}`}>
                  {feature}
                </td>
                <td className="px-4 py-3 text-ch-text-secondary">{free}</td>
                <td className="px-4 py-3 text-ch-text">{pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
