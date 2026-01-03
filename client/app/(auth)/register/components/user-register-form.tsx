"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {authClient} from "@/lib/auth.client";
import {toast} from "sonner";
import {apiClient} from "@/lib/api.client";
import {Profile, User} from "@/lib/types";
import {useState, SyntheticEvent} from 'react';

export function UserRegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [email, setEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [name, setName] = useState<string>("")

  // Creates an user account, and a profile associated to that user
  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    const isValid = /^[a-zA-Z0-9_]+$/.test(username);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!isValid) {
      toast.error("Username can only contain letters, numbers, and underscores")
      setIsLoading(false)
      return
    }

    try {
      const res = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
      })

      if (res.error) {
        toast.error(res.error.message)
        return
      }

      const user: User = res.data.user

      if (user){
        const user = res.data.user
        const profileResponse = await apiClient<ApiResponse<Profile>>("/profiles", {
          method: "POST",
          body: JSON.stringify({
            id: user.id,
            username: username,
            displayName: user.name,
            email: user.email,
          }),
        });

        if (!profileResponse.success) {
          toast.error(`Error creating profile. ${profileResponse.message}`)

          await authClient.deleteUser({
            password: password,
          })
          await authClient.signOut()
          return
        }
      }

      toast.success("Success! Redirecting...")
      window.location.href = "/" // app needs hard reload to update auth state
    } catch (error) {
      await authClient.deleteUser({
        password: password,
      })
      toast.error("There was an error signing up. Please try again. " + (error as Error).message)
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
                  id="username"
                  placeholder="username"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <Input
                  id="confirm-password"
                  placeholder="confirm password"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
              />
              <Input
                  id="name"
                  placeholder="name"
                  type="text"
                  autoCorrect="off"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
              />
            </Field>
            <Field>
              <Button
                  type="submit"
                  disabled={isLoading}>
                {isLoading && <Spinner />}
                Sign up
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
  )
}