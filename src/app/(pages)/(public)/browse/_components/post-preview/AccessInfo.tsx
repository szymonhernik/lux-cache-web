interface Props {
  minimumTier: '0' | '1' | '2' | '3' | null
  canAccess: boolean | 'loading' | undefined
}
export default function AccessInfo(props: Props) {
  return (
    <>
      <p>
        This content is for Supporters, Subscribers and Premium Subscribers
        only.
      </p>
      <button className="underline">Subscribe</button>
    </>
  )
}
