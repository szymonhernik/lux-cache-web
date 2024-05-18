import { defineType, defineArrayMember } from 'sanity'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export default defineType({
  title: 'Block Content Advanced',
  name: 'blockContentAdvanced',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'Quote', value: 'blockquote' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' }
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      }
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      name: 'imageInline',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption'
        },
        {
          name: 'size',
          type: 'string',
          title: 'Size',
          initialValue: 'default',
          options: {
            list: [
              { title: 'Small (around 30% of article width)', value: 'small' },
              {
                title: 'Default (around 50% of article width)',
                value: 'default'
              },
              {
                title: 'Medium (around 70% of article width)',
                value: 'medium'
              },
              { title: 'Wide (100% article width)', value: 'wide' }
            ]
          }
        }
      ]
    }),
    defineArrayMember({
      type: 'audioInline',
      description: 'Add an audio element.'
    }),
    defineArrayMember({
      type: 'video',
      description: 'Add an video element.'
    }),
    defineArrayMember({
      type: 'youtube'
    }),
    defineArrayMember({
      type: 'spotify'
    })
  ]
})
