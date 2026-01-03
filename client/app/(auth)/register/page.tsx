import { type Metadata } from "next"
import AuthPage from "@/app/(auth)/AuthPage";

export const metadata: Metadata = {
    title: "Register | Twitter Clone",
    description: "Create an account on Twitter Clone.",
}

export default function RegisterPage() {
    return AuthPage({mode: "register"})
}