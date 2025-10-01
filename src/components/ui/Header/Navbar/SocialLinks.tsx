import { SettingsQueryResult } from '@/utils/types/sanity/sanity.types'

export default function SocialLinks({
  socialLinks
}: {
  socialLinks: NonNullable<SettingsQueryResult>['linksSocials']
}) {
  return (
    <div className="text-zinc-500 flex flex-col text-sm gap-2">
      {socialLinks &&
        socialLinks.length > 0 &&
        socialLinks.map((link) => (
          <a href={link.linkURL} key={link.linkURL} target="_blank">
            <span>↳</span> {link.linkTitle}
          </a>
        ))}
      {/* <Link href="/newsletter">↳ Newsletter</Link> */}
      {/* <a href="/newsletter">↳ newsletter</a> */}
    </div>
  )
}
