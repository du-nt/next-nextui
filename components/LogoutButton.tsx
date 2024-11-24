"use client";

import useMutation from "@/hooks/useMutation";
import useBoundStore from "@/stores";
import { Button } from "@nextui-org/button";
import { DefaultError } from "@tanstack/react-query";

export default function LogoutButton() {
  const unAuthenticate = useBoundStore((state) => state.unAuthenticate);

  const { mutate } = useMutation<null, DefaultError, null>({
    endpoint: "logout",
    onSuccess: () => unAuthenticate(),
  });

  const handleLogout = () => {
    mutate(null);
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
