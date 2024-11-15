import { Button } from '@/components/shadcn/ui/button'
import { LoadingSpinner } from '@/components/Spinner'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({
  priceString,
  billingInterval
}: {
  priceString: string
  billingInterval: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      size={'xl'}
      variant={'outline'}
      className="w-full font-normal border-black tracking-tight disabled:bg-secondary"
    >
      {pending ? (
        <>
          <LoadingSpinner className="animate-spin mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        <span>
          Join for{` `}
          <span className="font-semibold">
            {priceString}/{billingInterval}
          </span>
          {` `}
          <span className="text-tertiary-foreground">(VAT incl)</span>
        </span>
      )}
    </Button>
  )
}
