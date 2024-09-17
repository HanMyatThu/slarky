import Quill, { QuillOptions } from "quill";
import { PiTextAa } from "react-icons/pi";
import { useEffect, useRef } from "react";

import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
    };
    new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-blue-300 focus-within:shadow-md transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <PiTextAa />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
