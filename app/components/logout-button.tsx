"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logout()}
      className="absolute top-4 right-4"
    >
      Logout
    </Button>
  );
}
