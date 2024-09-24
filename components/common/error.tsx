import { AlertTriangle } from "lucide-react";

interface ErrorIconProps {
  message: string;
}

export const Error = ({ message }: ErrorIconProps) => {
  return (
    <div className="h-full flex flex-col gap-y-3 items-center justify-center">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
