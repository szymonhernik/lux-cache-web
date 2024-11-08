interface ErrorMessageProps {
  title: string
  message: string
  children?: React.ReactNode
}

export default function ErrorMessage({
  title,
  message,
  children
}: ErrorMessageProps) {
  return (
    <section className="flex flex-col justify-center items-center w-full h-full">
      <h1 className="font-semibold">{title}</h1>
      <p>{message}</p>
      {children}
    </section>
  )
}
