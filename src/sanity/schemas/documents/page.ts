import { DocumentIcon, ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  type: 'document',
  name: 'page',
  title: 'Page',
  icon: DocumentIcon,
  groups: [
    {
      name: 'settings',
      title: 'Settings'
    },
    {
      name: 'content',
      title: 'Content'
    }
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      validation: (rule) => rule.required()
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      group: 'settings',
      options: {
        source: 'title'
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Overview',
      group: 'settings',
      type: 'array',
      of: [
        // Paragraphs
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [],
            decorators: [
              {
                title: 'Italic',
                value: 'em'
              },
              {
                title: 'Strong',
                value: 'strong'
              }
            ]
          },
          styles: [],
          type: 'block'
        })
      ],
      validation: (rule) => rule.max(155).required()
    }),
    defineField({
      name: 'pageContent',
      title: 'Page Content',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'mainBody'
        }),
        defineArrayMember({
          type: 'faq'
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        subtitle: 'Page',
        title
      }
    }
  }
})
