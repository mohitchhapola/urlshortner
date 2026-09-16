import { z } from "zod";

export const CreateUrlInput = z.object({
  url: z
    .url({
      protocol: /^https?$/,
      error: "URL must use HTTP or HTTPS",
    })
    .max(2048, "URL must not exceed 2048 characters"),
}).strict();

export type CreateUrlInput = z.infer<typeof CreateUrlInput>;

export const SignInInput = z
  .object({
    email: z
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password is too long"),
  })
  .strict();

export type SignInInput = z.infer<typeof SignInInput>;