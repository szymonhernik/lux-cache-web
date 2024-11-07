import { LoadingSpinner } from '@/components/Spinner'
import { ModalRadix } from '../../../_components/modal-radix'
import Card from '@/components/ui/Card'
export default function Loading() {
  return (
    <ModalRadix>
      <div className="flex justify-center p-4  bg-white pb-24">
        <div className="flex justify-center max-w-96 w-[90vw] p-3   ">
          <LoadingSpinner />
        </div>
      </div>
    </ModalRadix>
  )
}
