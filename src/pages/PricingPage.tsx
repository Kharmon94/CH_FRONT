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
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="mt-4 text-zinc-400">Free to browse. Pro unlocks Agent Clone and unlimited exports.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-3xl font-bold">$0</p>
          <p className="mt-4 text-sm text-zinc-400">Browse everything. Export one chat.</p>
        </Card>
        <Card className="border-emerald-500/40">
          <h2 className="text-xl font-semibold text-emerald-400">Pro</h2>
          <p className="mt-2 text-3xl font-bold">$7<span className="text-lg text-zinc-400">/mo</span></p>
          <p className="text-sm text-zinc-400">or $50/year</p>
          <p className="mt-4 text-sm text-violet-300">Includes Agent Clone — our flagship feature.</p>
          <Link to="/app/billing" className="mt-6 inline-block">
            <Button variant="primary">Upgrade in app</Button>
          </Link>
          <p className="mt-2 text-xs text-zinc-500">Run locally via bin/dev to upgrade and export.</p>
        </Card>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">Feature</th>
              <th className="px-4 py-3 text-left">Free</th>
              <th className="px-4 py-3 text-left">Pro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feature, free, pro]) => (
              <tr key={feature} className="border-t border-zinc-800">
                <td className={`px-4 py-3 ${feature.includes("Agent Clone") ? "text-violet-300" : ""}`}>
                  {feature}
                </td>
                <td className="px-4 py-3 text-zinc-400">{free}</td>
                <td className="px-4 py-3 text-zinc-300">{pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
