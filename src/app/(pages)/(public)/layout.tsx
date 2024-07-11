export default function RootLayout(props: {
  children: React.ReactNode
  login: React.ReactNode
}) {
  return (
    <>
      {props.children}
      {props.login}
    </>
  )
}
