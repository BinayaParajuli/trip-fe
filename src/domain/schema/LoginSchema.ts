import { z } from "zod"

export const LoginSchema = z.object({
  username:z.string().email("Invalid email address"),
  password:z.string()
})

export type TLoginSchema = z.infer<typeof LoginSchema>