import { StackCompactIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: StackCompactIcon,
  fields: [
    defineField({
      type: 'array',
      name: 'faqItems',
      title: 'FAQ Items',
      of: [
        defineField({
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              type: 'string',
              name: 'question',
              title: 'Question',
              validation: (rule) => rule.required()
            }),
            defineField({
              type: 'blockContentSimple',
              name: 'answer',
              title: 'Answer',
              validation: (rule) => rule.required()
            })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      //   title: 'heading',
    },
    prepare() {
      return {
        title: 'FAQ'
      }
    }
  }
})
