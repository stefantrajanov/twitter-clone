"use client"

import { Button } from "@/components/ui/button"
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {authClient} from "@/lib/auth.client";
import {toast} from "sonner";
import {SyntheticEvent, useState} from "react";

export function UserLoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function onSubmit(event: SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const res = await authClient.signIn.email({
                email: email,
                password: password,
            })

            if (res.error) {
                toast.error(res.error.message)
                return
            }

            toast.success("Success! Redirecting...")
            window.location.href = "/" // app needs hard reload to update auth state
        } catch (error) {
            toast.error("There was an error signing up. Please try again.")
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={onSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel className="sr-only" htmlFor="email">
                            Email
                        </FieldLabel>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <Input
                            id="password"
                            placeholder="password"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </Field>
                    <Field>
                        <Button
                            type="submit"
                            disabled={isLoading}>
                            {isLoading && <Spinner />}
                            Sign in
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}