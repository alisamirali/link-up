"use client";

import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

type Props = {
  placeholder: string;
};

export function ChatInput({ placeholder }: Props) {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="w-full px-5">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
}
