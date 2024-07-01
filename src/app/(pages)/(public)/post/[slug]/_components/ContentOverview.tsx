import { Button } from '@/components/shadcn/ui/button'
import FiltersPreview from '../../../browse/_components/post-preview/FilterPreview'

interface Props {
  publishedAt: string | null | undefined
  filters:
    | Array<{
        slug: string | null
      }>
    | null
    | undefined
}
export default function ContentOverview(props: Props) {
  const { publishedAt, filters } = props

  // Convert it to a Date object
  const dateObj = publishedAt ? new Date(publishedAt) : ''

  // Use Intl.DateTimeFormat to format the date in the desired style
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  // @ts-ignore
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
    //@ts-ignore
    dateObj
  )
  return (
    <>
      <p className="text-sm tracking-tight">{formattedDate}</p>
      <FiltersPreview filters={filters} variantClass={'text-xs '} />
      <p className="font-neue text-lg md:text-xl">
        In this Lux Cache track breakdown series, we invite artists, producers,
        engineers and songwriters to uncover the creative process of their work
        in their own words. In this chapter, we are joined by IDM visionary and
        Planet Mu founder u-Ziq (aka Mike Paradinas) to discuss his 30+ year
        legacy career in electronic music, discussing working alongside peers
        such as Aphex Twin and Squarepusher and breaking down the production of
        his recent single ‘Goodbye’, giving us a behind-the-scenes look at his
        offkilter breakbeat sound.
      </p>
      <Button className="w-fit">Downloads</Button>
    </>
  )
}
