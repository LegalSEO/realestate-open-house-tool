"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatPhoneNumber } from "@/lib/utils"

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(14, "Phone number must be 10 digits"),
  preApproved: z.enum(["yes", "no", "not-sure"], {
    required_error: "Please select an option",
  }),
  hasAgent: z.enum(["true", "false"], {
    required_error: "Please select an option",
  }),
  timeline: z.enum(["0-30 days", "1-3 months", "3-6 months", "6+ months"], {
    required_error: "Please select a timeline",
  }),
  interestedIn: z.enum(["buying", "just-looking", "investment"], {
    required_error: "Please select an option",
  }),
})

type FormData = z.infer<typeof formSchema>

interface SignInFormProps {
  eventId: string
  shortCode: string
}

export function SignInForm({ eventId, shortCode }: SignInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preApproved: undefined,
      hasAgent: undefined,
      timeline: undefined,
      interestedIn: undefined,
    },
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          eventId,
          hasAgent: data.hasAgent === "true",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setShowSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/event/${shortCode}/details`)
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Sign In to View Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(312) 555-1234"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pre-Approved */}
              <FormField
                control={form.control}
                name="preApproved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are you pre-approved for a mortgage?</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="">Select an option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="not-sure">Not Sure</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Has Agent */}
              <FormField
                control={form.control}
                name="hasAgent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you currently have a real estate agent?</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="">Select an option</option>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timeline */}
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When are you looking to buy?</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="">Select a timeline</option>
                        <option value="0-30 days">0-30 days</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interested In */}
              <FormField
                control={form.control}
                name="interestedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What brings you here today?</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="">Select an option</option>
                        <option value="buying">Seriously considering buying</option>
                        <option value="just-looking">Just looking</option>
                        <option value="investment">Investment property</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Sign In & View Full Details"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You!</DialogTitle>
            <DialogDescription>
              Your information has been submitted successfully. You'll be redirected to
              view the full property details in a moment.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
