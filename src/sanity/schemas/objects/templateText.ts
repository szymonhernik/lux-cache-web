import { InsertAboveIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'templateText',
  title: 'Template Texts',
  type: 'object',
  icon: InsertAboveIcon,
  fields: [
    defineField({
      type: 'array',
      name: 'templateText',
      title: 'Template Texts',
      of: [{ type: 'reference', to: { type: 'templates' } }]
    })
  ],
  preview: {
    select: {
      //   title: 'heading',
    },
    prepare() {
      return {
        title: 'Template Texts'
      }
    }
  }
})
