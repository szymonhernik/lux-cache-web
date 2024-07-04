import { BsPlayBtn } from 'react-icons/bs'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'coverVideo',
  type: 'object',
  title: 'Video asset',
  icon: BsPlayBtn,
  fields: [
    defineField({
      title: 'Video file',
      name: 'videoFile',
      type: 'mux.video'
    })
  ]
})
