import { z } from "zod"

// Error messages are keys under "Validation" in the message files.

export const LoginSchema = z.object({
  username:z.string().email("invalidEmail"),
  password:z.string()
})

export type TLoginSchema = z.infer<typeof LoginSchema>