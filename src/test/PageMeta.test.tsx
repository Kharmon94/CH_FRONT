import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { PageMeta } from "../components/seo/PageMeta";

function renderMeta(props: React.ComponentProps<typeof PageMeta>) {
  return render(
    <HelmetProvider>
      <PageMeta {...props} />
    </HelmetProvider>
  );
}

describe("PageMeta", () => {
  it("renders title and description in document head", async () => {
    renderMeta({
      title: "Pricing",
      description: "Plans for Cursor chat export and Agent Clone.",
      path: "/pricing",
    });

    await waitFor(() => {
      expect(document.title).toBe("Pricing — Cursor Help");
    });

    const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe(
      "Plans for Cursor chat export and Agent Clone."
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe("https://www.cursorhelp.com/pricing");
  });

  it("uses default title when title is omitted", async () => {
    renderMeta({
      description: "Local-first Cursor chat export.",
      path: "/",
    });

    await waitFor(() => {
      expect(document.title).toBe("Cursor Help");
    });
  });
});
