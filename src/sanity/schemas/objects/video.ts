import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'video',
  type: 'object',
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
