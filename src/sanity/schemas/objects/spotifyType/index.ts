// ./schemaTypes/youTubeType/index.ts

import { defineType, defineField } from 'sanity'

import { SpotifyPreview } from './SpotifyPreview'
import { BsSpotify } from 'react-icons/bs'

export const spotify = defineType({
  name: 'spotify',
  type: 'object',
  title: 'Spotify Embed',
  icon: BsSpotify,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'Spotify URL (playlist, album, or track)'
    })
  ],
  preview: {
    select: { title: 'url' }
  },
  components: {
    preview: SpotifyPreview
  }
})
