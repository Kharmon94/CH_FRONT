import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Button } from "../ui/Button";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-xs font-medium transition ${
        active
          ? "bg-ch-primary/15 text-ch-primary"
          : "text-ch-text-secondary hover:bg-ch-surface-elevated hover:text-ch-text"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = "Write your post…" }: RichTextEditorProps) {
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState(value);
  const [htmlError, setHtmlError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      if (!htmlMode) onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[280px] px-4 py-3 text-sm text-ch-text focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || htmlMode) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor, htmlMode]);

  const toggleHtmlMode = useCallback(() => {
    if (htmlMode) {
      setHtmlError(null);
      try {
        if (editor) {
          editor.commands.setContent(htmlDraft || "", { emitUpdate: false });
          onChange(editor.getHTML());
        } else {
          onChange(htmlDraft);
        }
        setHtmlMode(false);
      } catch {
        setHtmlError("Could not parse HTML. Fix syntax before switching to visual mode.");
      }
    } else {
      const current = editor?.getHTML() ?? value;
      setHtmlDraft(current);
      setHtmlMode(true);
    }
  }, [htmlMode, htmlDraft, editor, onChange, value]);

  function applyHtmlDraft() {
    setHtmlError(null);
    try {
      if (editor) {
        editor.commands.setContent(htmlDraft || "", { emitUpdate: false });
        onChange(editor.getHTML());
      } else {
        onChange(htmlDraft);
      }
    } catch {
      setHtmlError("Invalid HTML.");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ch-border bg-ch-surface-elevated">
      <div className="flex flex-wrap items-center gap-1 border-b border-ch-border px-2 py-2">
        {!htmlMode && editor ? (
          <>
            <ToolbarButton
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              B
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              I
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              U
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("heading", { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet list"
            >
              • List
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered list"
            >
              1. List
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const url = window.prompt("Link URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              title="Link"
            >
              Link
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
              Undo
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
              Redo
            </ToolbarButton>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {htmlMode ? (
            <Button type="button" variant="secondary" onClick={applyHtmlDraft}>
              Apply HTML
            </Button>
          ) : null}
          <ToolbarButton active={htmlMode} onClick={toggleHtmlMode} title="Toggle HTML source">
            HTML
          </ToolbarButton>
        </div>
      </div>

      {htmlError ? <p className="px-4 py-2 text-sm text-red-400">{htmlError}</p> : null}

      {htmlMode ? (
        <textarea
          value={htmlDraft}
          onChange={(e) => {
            setHtmlDraft(e.target.value);
            onChange(e.target.value);
          }}
          spellCheck={false}
          className="min-h-[320px] w-full resize-y bg-ch-bg px-4 py-3 font-mono text-xs leading-relaxed text-ch-text focus:outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
