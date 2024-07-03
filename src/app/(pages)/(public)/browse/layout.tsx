export default function Layout({ children }: { children: React.ReactNode }) {
  // const queryClient = new QueryClient()
  return (
    <div>
      {children}

      {/* {props.modal} */}
      <div id="modal-root" />
    </div>
  )
}
