import { CheckCircleIcon } from 'lucide-react'

export default function Page() {
  // render a simple confirmation layout
  return (
    <div className="flex flex-col ">
      {/* <h1 className="text-2xl font-bold mb-2">Success</h1> */}

      <p className="">
        {/* you will receive a discount at a checkout once we launch */}
        <span className="font-semibold">
          Success, you are on the early access list.
        </span>{' '}
        Please check your email for more information.
      </p>
    </div>
  )
}
