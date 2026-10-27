"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authServices } from "@/domain/services/authService"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, TRegisterSchema } from "@/domain/schema/RegisterSchema"


export default function Register() {
  const t = useTranslations("Register")
  const tv = useTranslations("Validation")
  const fieldError = (message?: string) => message && <p className="text-red-500">{tv(message as Parameters<typeof tv>[0])} </p>
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("callbackUrl") || "/"

  const {register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm<TRegisterSchema>({
    resolver:zodResolver(RegisterSchema)
  })

  const onSubmit = async (data:TRegisterSchema) => {
    try {
      const response = await authServices.register(data)
      router.push(`/login?callbackUrl=${redirect}`)
    } catch (err:any) {
      for (const e of err.response.data.errors){
        toast.error(e.detail, { position: "top-right" })
      }
    }
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
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder={t("namePlaceholder")}
                autoComplete="name"
              />
              {fieldError(errors.name?.message)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {fieldError(errors.password?.message)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {fieldError(errors.confirmPassword?.message)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="example@gmail.com"
                
              />
              {fieldError(errors.email?.message)}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              { isSubmitting ? t("submitting") : t("submit")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("haveAccount")}{" "}
              <Link href={`/login?redirect=${redirect}`} className="text-primary hover:underline">
                {t("loginHere")}
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
