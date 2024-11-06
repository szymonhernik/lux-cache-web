import {
  ImagesIcon,
  UserIcon
} from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mentorsGallery',
  title: 'Mentors Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      type: 'array',
      name: 'galleryItems',
      title: 'Gallery Items',
      of: [
        defineField({
          type: 'object',
          name: 'galleryItem',
          title: 'Gallery Item',
          fields: [
            defineField({
              type: 'string',
              name: 'name',
              title: 'Name',
              validation: (rule) => rule.required()
            }),
            defineField({
              type: 'image',
              icon: UserIcon,
              name: 'image',
              title: 'Image',
              options: {
                hotspot: true
              },
              validation: (rule) => rule.required(),
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
              name: 'description',
              title: 'Description',
              type: 'blockContentSimple',
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
        title: 'Mentors Gallery'
      }
    }
  }
})
