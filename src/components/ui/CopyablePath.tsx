import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./Button";

export function CopyablePath({ path, className = "" }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPath() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = path;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className={`flex items-stretch gap-2 ${className}`}>
      <code className="min-w-0 flex-1 rounded-lg border border-ch-border bg-ch-surface-elevated px-3 py-2 font-mono text-xs text-ch-text-secondary break-all">
        {path}
      </code>
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 px-3"
        aria-label={copied ? "Copied" : "Copy path"}
        onClick={() => void copyPath()}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
