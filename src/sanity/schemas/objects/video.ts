import { BsPlayBtn } from 'react-icons/bs'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'video',
  type: 'object',
  title: 'Video asset',
  icon: BsPlayBtn,
  fields: [
    defineField({
      name: 'videoLabel',
      type: 'string'
    }),
    defineField({
      title: 'Video file',
      name: 'videoFile',
      type: 'mux.video'
    })
  ]
})
