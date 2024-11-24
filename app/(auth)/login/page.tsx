"use client";

import useMutation from "@/hooks/useMutation";
import { LoginFormSchema, LoginFormValues } from "@/schemas/login_form_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultError, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation<
    null,
    DefaultError,
    LoginFormValues
  >({
    endpoint: "login",
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const onSubmit = (formValues: LoginFormValues) => {
    // queryClient.resetQueries();
    mutate(formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Username:
        <input {...register("username")} />
        {errors.username && <p>{errors.username.message}</p>}
      </label>
      <label>
        Password:
        <input {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
