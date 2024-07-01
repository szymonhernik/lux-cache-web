import { InsertAboveIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'introText',
  title: 'Intro Text',
  type: 'object',
  icon: InsertAboveIcon,
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
        title: ' Intro Text'
      }
    }
  }
})
