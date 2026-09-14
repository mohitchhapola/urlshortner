import { z } from "zod";

const CreateUrlInput = z.object({
    url: z.url().min(1, "URL is required").max(1000, "URL is too long"),

})
export type CreateUrlInputType = z.infer<typeof CreateUrlInput>;

const SigninInput = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})
export type SigninInputType = z.infer<typeof SigninInput>;