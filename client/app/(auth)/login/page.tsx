import { type Metadata } from "next"
import AuthPage from "@/app/(auth)/AuthPage";

export const metadata: Metadata = {
    title: "Login | Twitter Clone",
    description: "Login to your account on Twitter Clone.",
}

export default function RegisterPage() {
    return AuthPage({mode: "login"})
}