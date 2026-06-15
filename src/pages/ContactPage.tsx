import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const CONTACT_EMAIL = "hello@cursorhelp.com";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Cursor Help — message from ${name || "visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`.trim()
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Contact us
      </h1>
      <p className="mt-4 max-w-2xl text-ch-text-secondary">
        Questions about billing, exports, or getting started? Send us a note — we typically reply
        within one business day.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-ch-text">Email</h2>
          <p className="mt-2 text-sm text-ch-text-secondary">
            Prefer to write directly? Reach us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ch-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-ch-text-secondary">
            For account or billing issues, include the email on your Cursor Help account.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-ch-text">Send a message</h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-sm text-ch-text-secondary">
                Name
              </label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm text-ch-text-secondary">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1 block text-sm text-ch-text-secondary">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="How can we help?"
                className="w-full rounded-xl border border-ch-border bg-ch-surface-elevated px-3 py-2 text-sm text-ch-text placeholder:text-ch-text-secondary focus:border-ch-primary focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary">
              Open in email app
            </Button>
          </form>
        </Card>
      </div>

      <p className="mt-8 text-sm text-ch-text-secondary">
        Looking for quick answers? Check the{" "}
        <Link to="/help" className="text-ch-primary hover:underline">
          Help & FAQ
        </Link>{" "}
        page first.
      </p>
    </main>
  );
}
