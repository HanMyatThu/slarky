import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { Id } from "@/convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();

  const { mutate: uploadImage } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    setPending(true);
    editorRef.current?.enable(false);
    try {
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await uploadImage({}, { throwError: true });

        if (!url) {
          throw new Error("Undefined URL");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload Image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      editorRef.current?.enable(true);
      setPending(false);
    }
  };

  return (
    <div className="px-5 w-full pb-4">
      <Editor
        key={editorKey}
        placeHOlder={placeholder}
        onSubmit={handleSubmit}
        disabled={pending}
        innerRef={editorRef}
      />
    </div>
  );
};
