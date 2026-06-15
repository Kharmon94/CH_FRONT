export type FaqItem = { question: string; answer: string };

export const HELP_FAQS: FaqItem[] = [
  {
    question: "What is Cursor Help?",
    answer:
      "Cursor Help is a local-first tool for Cursor chat export and agent recovery. It indexes your composer sessions, lets you search every chat, export markdown, and generate Agent Clone handoff files so you can continue in a fresh agent chat.",
  },
  {
    question: "Does Cursor Help upload my Cursor database?",
    answer:
      "No. Your Cursor database stays on your machine. Cursor Help reads it locally via the path you link in the app. We do not upload raw chat databases to our servers — only account and team metadata when you use cloud features.",
  },
  {
    question: "How do I link my Cursor database?",
    answer:
      "Sign in, open the app dashboard, and paste the path to your Cursor database. The API indexes composers in the background — refresh the dashboard to see index status and composer counts.",
  },
  {
    question: "What is Agent Clone export?",
    answer:
      "Agent Clone bundles every session sharing the same composer name into one structured handoff file. Attach it to a new Cursor Agent, paste the included Start here prompt, and pick up where you left off. Available on Pro.",
  },
  {
    question: "What's included on Free vs Pro?",
    answer:
      "Free: browse and search all chats, one markdown chat export. Pro: unlimited markdown exports, Agent Clone, batch export, and full export history re-downloads. See Pricing for the full comparison.",
  },
  {
    question: "Is Cursor Help affiliated with Cursor?",
    answer:
      "No. Cursor Help is an independent tool and is not affiliated with, endorsed by, or sponsored by Cursor or Anysphere.",
  },
  {
    question: "Google sign-in fails or OAuth errors",
    answer:
      "Make sure the API is running and reachable, and that Google OAuth env vars are set on the API service. If you see a server error on sign-in, contact us with the time of the attempt and the email on your account.",
  },
  {
    question: "How do I cancel Pro?",
    answer:
      "Open Billing in the app (team owner) and use the Stripe customer portal to manage or cancel your subscription. Your team reverts to Free at the end of the billing period.",
  },
];
