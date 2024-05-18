import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'
import { Spotify } from 'react-spotify-embed'

export function SpotifyPreview(props: PreviewProps) {
  const { title: link } = props

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof link === 'string' ? (
        <Spotify wide link={link} />
      ) : (
        <Text>Add a Spotify URL</Text>
      )}
    </Flex>
  )
}
