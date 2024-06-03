import { Button } from '@/components/shadcn/ui/button'
import { useCustomCheckout } from '@stripe/react-stripe-js'
import { useState } from 'react'

export default function PromotionCodeForm() {
  const { applyPromotionCode, removePromotionCode } = useCustomCheckout()
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value)
  }
  const handleSubmit = () => {
    setLoading(true)
    applyPromotionCode(draft).finally(() => {
      setDraft('')
      setLoading(false)
    })
  }
  const handleRemove = () => {
    removePromotionCode()
  }

  return (
    <div className="flex flex-col ">
      <h1 className="font-bold text-xl mb-4">Promotion Code</h1>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={draft}
            placeholder="Add promotion code"
            onChange={handleChange}
            className="text-[#30313D] appearance-auto p-3 rounded"
          />
          <Button disabled={loading} onClick={handleSubmit}>
            Apply
          </Button>
        </div>
        <p className="text-sm">
          <button className="underline " onClick={handleRemove}>
            Remove
          </button>{' '}
          the promotion code.
        </p>
      </div>
    </div>
  )
}
