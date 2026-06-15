import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RichTextEditor } from "../components/admin/RichTextEditor";

describe("RichTextEditor", () => {
  it("toggles HTML mode and syncs value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RichTextEditor value="<p>Hello world</p>" onChange={onChange} />);

    await user.click(screen.getByTitle("Toggle HTML source"));
    const textarea = document.querySelector("textarea");
    expect(textarea).toHaveValue("<p>Hello world</p>");

    if (textarea) {
      await user.clear(textarea);
      await user.type(textarea, "<p>Updated</p>");
    }
    expect(onChange).toHaveBeenCalled();

    await user.click(screen.getByTitle("Toggle HTML source"));
    expect(document.querySelector("textarea")).not.toBeInTheDocument();
  });
});
