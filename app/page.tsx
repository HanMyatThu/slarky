"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";

const Home = () => {
  const { signOut } = useAuthActions();
  return (
    <div>
      Hello <span>World</span>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export default Home;
