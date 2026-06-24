"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  CreateLink,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface MarkdownEditorProps {
  markdown: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  dir?: "rtl" | "ltr";
}

export default function MarkdownEditor({
  markdown,
  onChange,
  disabled = false,
  dir = "ltr",
}: MarkdownEditorProps) {
  return (
    <div
      className=" inset-0 border border-neutral-200/80 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden"
      dir={dir}
    >
      <style>{`
        .mdxeditor {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          max-height: 100% !important;
          width: 100% !important;
          overflow: hidden !important;
        }
        
        .mdxeditor > div:first-child {
          flex: 0 0 auto !important;
        }
        
        .mdxeditor > div:last-child {
          flex: 1 1 0% !important;
          overflow-y: auto !important;
          min-height: 0 !important;
        }

        .mdxeditor > * {
         direction: ${dir} !important;
        }
      `}</style>

      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        readOnly={disabled}
        contentEditableClassName="prose max-w-none p-5 focus:outline-none leading-relaxed text-sm text-neutral-800 font-inter font-ge-ss-two"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-neutral-50 border-b border-neutral-100 w-full shrink-0">
                <UndoRedo />
                <span className="h-5 w-px bg-neutral-200 mx-1" />
                <BoldItalicUnderlineToggles />
                <span className="h-5 w-px bg-neutral-200 mx-1" />
                <BlockTypeSelect />
                <span className="h-5 w-px bg-neutral-200 mx-1" />
                <ListsToggle />
                <span className="h-5 w-px bg-neutral-200 mx-1" />
                <CreateLink />
                <InsertTable />
                <InsertCodeBlock />
              </div>
            ),
          }),
        ]}
      />
    </div>
  );
}
