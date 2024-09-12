"use client";

import { Provider } from "jotai";

interface JotaiProverProps {
  children: React.ReactNode;
}

export const JotaiProvider = ({ children }: JotaiProverProps) => {
  return <Provider>{children}</Provider>;
};
