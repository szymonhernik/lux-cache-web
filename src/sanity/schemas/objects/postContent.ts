import { BlockContentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'postContent',
  title: 'Post Content',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      type: 'blockContentAdvanced',
      name: 'body',
      title: 'Body',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      //   title: 'heading',
    },
    prepare() {
      return {
        title: 'Post Content'
      }
    }
  }
})
