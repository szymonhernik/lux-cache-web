import { BlockElementIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'templates',
  title: 'Templates',
  type: 'document',
  icon: BlockElementIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    })
  ]
})
