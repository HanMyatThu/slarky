/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[600px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="Message image zoom"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};
