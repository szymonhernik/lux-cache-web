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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
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
