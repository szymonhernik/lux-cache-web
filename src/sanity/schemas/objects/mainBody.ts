import { BlockContentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mainBody',
  title: 'Main Body',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      type: 'blockContentSimple',
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
        title: 'Main Body'
      }
    }
  }
})
