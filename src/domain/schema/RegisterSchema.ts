import {z} from "zod"

// Error messages are keys under "Validation" in the message files.

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "nameTooShort"),

    email: z
      .string()
      .email("invalidEmail"),

    password: z
      .string()
      .min(8, "passwordTooShort"),

    confirmPassword: z
      .string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordsDontMatch",
  });


export type TRegisterSchema = z.infer<typeof RegisterSchema>