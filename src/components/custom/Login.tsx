"use client"

// next/navigation's router on purpose: callbackUrl already carries the locale prefix.
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, TLoginSchema } from "@/domain/schema/LoginSchema"
import { signIn } from "next-auth/react";


export default function Login() {
  const t = useTranslations("Login")
  const tv = useTranslations("Validation")
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("callbackUrl") || "/"

  const { register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: TLoginSchema) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: redirect,
    })
    if (!res) {
      toast.error(t("error"))
      return
    }

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success(t("success"))
    router.push(redirect )
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="username">{t("email")}</Label>
              <Input
                {...register("username")}
                id="username"
                type="email"
                placeholder="example@gmail.com"
                // required
              />
              { errors.username &&
                 <p className="text-red-500">{tv(errors.username.message as Parameters<typeof tv>[0])} </p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                // name="password"
                // onChange={handleChange}
                // required
              />
              { errors.password &&
                 <p className="text-red-500">{errors.password.message as string} </p>
              }
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("noAccount")}{" "}
              <Link href={`/register?redirect=${redirect}`} className="text-primary hover:underline">
                {t("registerHere")}
              </Link><br/>
              <Link href="/" className="text-primary">
                {t("home")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
