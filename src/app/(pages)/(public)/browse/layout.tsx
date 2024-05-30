import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QueryWrapper from './_components/QueryWrapper'

export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <div>
      {children}
      {modal}
      {/* {props.modal} */}
      <div id="modal-root" />
    </div>
  )
}
