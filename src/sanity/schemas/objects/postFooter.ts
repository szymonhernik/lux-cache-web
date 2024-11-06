import { InsertBelowIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'postFooter',
  type: 'object',
  title: 'Post footer',
  icon: InsertBelowIcon,
  fields: [
    defineField({
      name: 'postFooterContent',
      type: 'blockContentSimple'
    })
  ],
  preview: {
    select: {
      // title: 'postFooterContent'
    },
    prepare() {
      return {
        title: `Post footer`
      }
    }
  }
})
