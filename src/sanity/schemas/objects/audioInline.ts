import { defineField, defineType } from 'sanity'
import { BsSoundwave } from 'react-icons/bs'

export default defineType({
  name: 'audioInline',
  type: 'object',
  title: 'Audio asset inline',
  icon: BsSoundwave,
  fields: [
    defineField({
      name: 'audioLabel',
      type: 'string'
    }),
    defineField({
      title: 'Audio file',
      name: 'audioFile',
      type: 'mux.video'
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL',
      type: 'url'
    })
  ]
})
