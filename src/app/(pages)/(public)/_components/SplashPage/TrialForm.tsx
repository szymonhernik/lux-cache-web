'use client'
import { Button } from '@/components/shadcn/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Add form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

export default function TrialForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: any) => {
    // Encode email for URL
    const encodedEmail = encodeURIComponent(values.email)
    router.push(`/signin/signup?email=${encodedEmail}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  w-full bg-red-200"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="email address"
                  {...field}
                  className="rounded-none bg-white placeholder:italic  placeholder:text-secondary-foreground placeholder:text-sm h-12 shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#D662AA] hover:bg-[#D662AA]/80 focus:bg-[#D662AA]/80 rounded-none h-12 flex-0"
        >
          <ChevronRightIcon className="fill-white w-8 h-8" />
          {/* Start Free Trial */}
        </Button>
      </form>
    </Form>
  )
}
