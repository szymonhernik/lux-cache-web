import { InlineElementIcon } from '@sanity/icons'
import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Block Content (simple)',
  name: 'blockContentSimple',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      of: [
        {
          title: 'Inline Icon (.svg)',
          name: 'inlineicon',
          type: 'image',
          options: {
            accept: 'image/svg+xml'
          },
          icon: InlineElementIcon
        }
      ],
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      // custom: [
      //   {
      //     title: 'Inline Icon',
      //     name: 'inlineicon',
      //     type: 'image',
      //     icon: InlineElementIcon
      //   }
      // ],
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' }
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
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
          // {
          //   title: 'Inline Icon',
          //   name: 'inlineicon',
          //   type: 'image',
          //   icon: InlineElementIcon
          // }
        ]
      }
    }),
    defineArrayMember({
      type: 'templateText'
    })
  ]
})
