const episodes = [
  {
    id: 'ep1',
    title: 'The Dawn of Rhythm',
    artistId: 'artist1',
    seriesId: 'series1',
    tagIds: ['tag1', 'tag2'],
    description:
      'In this episode, we explore the origins of rhythm and how it has evolved over time.'
  },
  {
    id: 'ep2',
    title: 'Echoes of the Past',
    artistId: 'artist2',
    seriesId: 'series1',
    tagIds: ['tag3'],
    description:
      'A journey through the classical compositions that have shaped music history.'
  }
]

const series = [
  {
    id: 'series1',
    name: 'Exploring Sound',
    description:
      'A series dedicated to exploring different aspects of music and sound production.'
  }
]

const artists = [
  {
    id: 'artist1',
    name: 'John Doe',
    bio: 'A pioneering musician known for his eclectic use of modern synthesizers.'
  },
  {
    id: 'artist2',
    name: 'Jane Smith',
    bio: 'A historian of music with a focus on classical compositions.'
  }
]

const tags = [
  {
    id: 'tag1',
    name: 'Electronic'
  },
  {
    id: 'tag2',
    name: 'Experimental'
  },
  {
    id: 'tag3',
    name: 'Classical'
  }
]

export { episodes, series, artists, tags }
