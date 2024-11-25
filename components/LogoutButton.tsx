"use client";

import useMutation from "@/hooks/useMutation";
import useBoundStore from "@/stores";
import { Button } from "@nextui-org/button";
import { DefaultError, useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const unAuthenticate = useBoundStore((state) => state.unAuthenticate);
  const queryClient = useQueryClient();

  const { mutate } = useMutation<null, DefaultError, null>({
    endpoint: "logout",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
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
