import { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  footer?: ReactNode
  children: ReactNode
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full  mx-auto ">
      <div className="max-w-screen-sm lg:max-w-full">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        <p className="">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="text-sm text-secondary-foreground mt-4">{footer}</div>
      )}
    </div>
  )
}
