import { ImageIcon, LinkIcon, UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artists',
  type: 'document',
  icon: UserIcon,
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      type: 'image',
      icon: ImageIcon,
      name: 'image',
      title: 'Image',
      options: {
        hotspot: true
      },
      preview: {
        select: {
          imageUrl: 'asset.url',
          title: 'caption'
        }
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Alternative text for screenreaders.'
        })
      ]
    }),
    defineField({
      title: 'Bio',
      name: 'bio',
      type: 'text'
    }),
    defineField({
      name: 'linksArtist',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              title: 'Link title',
              name: 'linkTitle',
              type: 'string'
            }),
            defineField({
              name: 'linkURL',
              title: 'URL',
              type: 'url'
            })
          ],
          preview: {
            select: {
              title: 'linkTitle',
              subtitle: 'linkURL'
            },
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                title: title,
                subtitle: subtitle,
                media: LinkIcon
              }
            }
          }
        })
      ]
    })
  ]
})
