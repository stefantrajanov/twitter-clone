import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FieldDescription } from "@/components/ui/field"
import { UserRegisterForm } from "./register/components/user-register-form"
import { UserLoginForm } from "./login/components/user-login-form"
import {ModeToggle} from "@/components/shared/ModeToggle";

interface AuthPageProps {
    mode: "login" | "register";
}

export default function AuthPage({mode}: AuthPageProps) {
    return (
        <>
            <div className="container flex items-center justify-center lg:max-w-none h-dvh p-5">
                <div className="flex items-center justify-center lg:h-[1000px] lg:p-8">
                    <Link href={`/${mode == 'login' ? 'register' : 'login'}`} className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute top-4 right-4 md:top-8 md:right-8"
                    )}>
                        {mode === "login" ? "Register" : "Login"}
                    </Link>
                    <div className="absolute p-1 top-4 left-4 md:top-8 md:left-8">
                        <div className="flex items-center">
                            <ModeToggle variant="ghost"/>
                            <Link href="/">Twitter Clone</Link>
                        </div>
                    </div>
                    <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {mode === "login" ? "Sign Into your Account" : "Create an account"}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {mode === "login" ? "" : "Enter your information below to create your account"}
                            </p>
                        </div>
                        {mode === "login" ? <UserLoginForm/> : <UserRegisterForm/>}
                        <FieldDescription className="px-6 text-center">
                            By singing up, you agree to our{" "}
                            <Link href="/terms">Terms of Service</Link> and{" "}
                            <Link href="/privacy">Privacy Policy</Link>.
                        </FieldDescription>
                    </div>
                </div>
            </div>
        </>
    )
}