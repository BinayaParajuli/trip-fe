"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Enter your credentials to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
              />
              { errors.name &&
                 <p className="text-red-500">{errors.name.message as string} </p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              { errors.password &&
                 <p className="text-red-500">{errors.password.message as string} </p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Password</Label>
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              { errors.confirmPassword &&
                 <p className="text-red-500">{errors.confirmPassword.message as string} </p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="example@gmail.com"
                
              />
              { errors.email &&
                 <p className="text-red-500">{errors.email.message as string} </p>
              }
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              { isSubmitting ? "Registering..." : "Register"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={`/login?redirect=${redirect}`} className="text-primary hover:underline">
                Login here
              </Link><br/>
              <Link href="/" className="text-primary">
                Home
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
