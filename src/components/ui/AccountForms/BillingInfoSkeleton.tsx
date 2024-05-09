import { Button } from '@/components/shadcn/ui/button'
import Card from '@/components/ui/Card'

export default function BillingInfoScheleton() {
  return (
    <Card title="Payment Method">
      <div className="my-4 flex gap-2">
        <p className="font-semibold text-secondary-foreground ">
          Card on file:{' '}
        </p>
        <div className=" bg-neutral-200 animate-pulse min-h-full w-full sm:max-w-48 flex-1   rounded"></div>
      </div>

      <Button size="lg" disabled>
        Update payment method
      </Button>
    </Card>
  )
}
