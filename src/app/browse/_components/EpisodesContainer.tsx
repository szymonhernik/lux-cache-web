import Image from 'next/image'
import Link from 'next/link'

import GridTanstack from './GridTanstack'
import GridTanstackWrapper from './GridTanstackWrapper'
import ObservableGrid from './ObservableGrid'

const mockUrls = [
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF'
]

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url
}))

export default function EpisodesContainer() {
  return <ObservableGrid />
}
