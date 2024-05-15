import { DocumentIcon, ProjectsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Posts',
  icon: DocumentIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }),
    defineField({
      title: 'Published date',
      name: 'publishedAt',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        // @ts-ignore
        calendarTodayLabel: 'Today'
      }
    }),
    defineField({
      title: 'Minimum Tier for access',
      name: 'minimumTier',
      type: 'string',

      options: {
        list: [
          { title: 'Free', value: '0' },
          { title: 'Supporter', value: '1' },
          { title: 'Subscriber', value: '2' },
          { title: 'Premium Subscriber', value: '3' }
        ] // <-- predefined values
        // layout: 'radio' // <-- defaults to 'dropdown'
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }]
    }),

    defineField({
      name: 'filters',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'filterItem' } }]
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    })
  ],

  preview: {
    select: {
      title: 'title',
      artist: 'artist.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const { artist } = selection
      return { ...selection, subtitle: artist && `by ${artist}` }
    }
  }
})
