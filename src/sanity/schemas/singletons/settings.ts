import { CogIcon, EarthGlobeIcon, LinkIcon, MenuIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'menu',
      title: 'Menu',
      icon: MenuIcon
    },
    {
      name: 'SEO',
      title: 'SEO',
      icon: EarthGlobeIcon
    },
    {
      name: 'socials',
      title: 'Socials',
      icon: LinkIcon
    }
  ],
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'menuItems',
      group: 'menu',
      title: 'Menu Item list',
      description: 'Links displayed on the header of your site.',
      type: 'array',
      of: [
        {
          title: 'Reference',
          type: 'reference',
          to: [
            {
              type: 'home'
            },
            {
              type: 'page'
            }
          ]
        }
      ]
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      group: ['SEO'],
      type: 'image',
      description:
        'Displayed on social cards and search engine results for any page where the OG image is not defined.',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO and as a fallback for any page where the description is not defined.',
      title: 'Description',
      group: ['SEO'],
      type: 'array',
      of: [
        // Paragraphs
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url'
                  }
                ]
              }
            ],
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
      name: 'footerPDF',
      description:
        'This is a block of text that will be displayed at the bottom of every exported pdf.',
      title: 'Footer Info',
      type: 'blockContentSimple'
    }),
    defineField({
      name: 'linksSocials',
      title: 'Links',
      group: 'socials',
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Items'
      }
    }
  }
})
