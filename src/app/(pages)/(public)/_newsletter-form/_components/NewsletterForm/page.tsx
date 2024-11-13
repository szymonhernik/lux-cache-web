// 'use client'

// import { useState } from 'react'

// import { useRouter } from 'next/navigation'
// import Card from '@/components/ui/Card'
// import { Button } from '@/components/shadcn/ui/button'
// import { subscribeToNewsletter } from '@/utils/actions/newsletter'

// export default function NewsletterForm() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       const formData = new FormData(e.currentTarget)
//       const response = await subscribeToNewsletter(formData)
//       router.push(response)
//     } catch (error) {
//       console.error('Failed to subscribe:', error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card
//       title="Subscribe to Newsletter"
//       footer={
//         <Button
//           type="submit"
//           form="newsletterForm"
//           size="lg"
//           disabled={isSubmitting}
//           isLoading={isSubmitting}
//           loadingText="Subscribing"
//         >
//           Subscribe
//         </Button>
//       }
//     >
//       <form
//         id="newsletterForm"
//         onSubmit={onSubmit}
//         className="flex gap-4 flex-col *:space-y-2 *:flex *:flex-col"
//       >
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             className="w-full sm:w-3/4 p-3 rounded-sm border border-zinc-300 bg-transparent"
//             placeholder="Your email"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="name">Name (optional)</label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             className="w-full sm:w-3/4 p-3 rounded-sm border border-zinc-300 bg-transparent"
//             placeholder="Your name"
//           />
//         </div>
//       </form>
//     </Card>
//   )
// }
