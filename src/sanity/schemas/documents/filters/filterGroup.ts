import {
  DocumentIcon,
  FilterIcon,
  FolderIcon,
  ImageIcon,
  OlistIcon
} from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'filterGroup',
  title: 'Filter groups',
  type: 'document',
  icon: OlistIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'groupFilters',
      title: 'Group Filters',
      description:
        'These are the filters that will appear in Filters panel for this group.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'filterItem' }]
        })
      ]
    })
  ]
})
