import Link from 'next/link'

interface Props {
  minimumTier: '0' | '1' | '2' | '3'
  canAccess: boolean | null
}

const products = [
  { title: 'Free', value: '0' },
  { title: 'Supporter', value: '1' },
  { title: 'Subscriber', value: '2' },
  { title: 'Premium Subscriber', value: '3' }
]

export default function AccessInfo(props: Props) {
  const { minimumTier } = props
  // Filter products based on the minimum tier
  const accessibleProducts =
    minimumTier !== null
      ? products.filter(
          (product) => Number(product.value) >= Number(minimumTier)
        )
      : []

  // Get the titles of accessible products
  const accessibleTitles = accessibleProducts
    .map((product) => product.title)
    .join(', ')

  return (
    <>
      <p>This content is for: {accessibleTitles}</p>
      <Link href={'/pricing'} className="underline">
        Subscribe
      </Link>
    </>
  )
}
