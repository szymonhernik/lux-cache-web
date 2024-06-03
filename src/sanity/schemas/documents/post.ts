import {
  DocumentIcon,
  DownloadIcon,
  EarthGlobeIcon,
  ImageIcon,
  ImagesIcon,
  InfoFilledIcon,
  SparklesIcon,
  TiersIcon
} from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Posts',
  icon: DocumentIcon,
  type: 'document',
  groups: [
    {
      name: 'SEO',
      title: 'SEO',
      icon: EarthGlobeIcon
    },
    {
      name: 'access',
      title: 'Access',
      icon: TiersIcon
    },
    {
      name: 'basicInfo',
      title: 'Basic Information',
      icon: InfoFilledIcon
    },
    {
      name: 'content',
      title: 'Post Content',
      icon: SparklesIcon
    },
    {
      name: 'media',
      title: 'Media',
      icon: ImagesIcon
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      group: 'basicInfo',
      description:
        'The main title of the post, which will be displayed prominently.',
      type: 'string',
      validation: (rule) => rule.required()
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'SEO',
      description:
        'A URL-friendly version of the title. You can generate it from the title or edit it yourself. Must be unique.',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'ogDescription',
      group: 'SEO',
      title: 'Open Graph Description',
      type: 'text',
      rows: 3,

      description:
        'Displayed on social cards and search engine results. A brief description of the content, usually between 2 and 4 sentences.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'artistList',
      title: 'Artist List',
      group: 'basicInfo',
      description:
        'A list of artists contributing to the post. Each entry should reference an existing artist.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Artist Mention',

          name: 'artistMention',
          validation: (rule) => rule.required(),
          fields: [
            defineField({
              title: 'Artist',
              name: 'artistRef',
              type: 'reference',
              description: 'Reference to an artist document.',

              to: { type: 'artist' },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'additionalContext',
              title: 'Additional Context',
              description:
                'Additional information about the artist (optional). For example: "of Arrad & Lakker".',

              type: 'string'
            })
          ],
          preview: {
            select: {
              title: 'artistRef.name',
              subtitle: 'additionalContext',
              media: 'artistRef.image'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: selection.subtitle,
                media: selection.media
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'series',
      group: 'basicInfo',
      title: 'Part of Series',
      description: 'References to series that this post is part of.',

      type: 'array',
      of: [{ type: 'reference', to: { type: 'series' } }]
    }),
    defineField({
      title: 'Published date',
      name: 'publishedAt',
      group: 'basicInfo',
      type: 'date',
      description:
        'The date when the post was published. This helps in organizing and sorting posts.',
      options: {
        dateFormat: 'YYYY-MM-DD',
        // @ts-ignore
        calendarTodayLabel: 'Today'
      }
    }),
    defineField({
      title: 'Minimum Tier for access',
      name: 'minimumTier',
      group: ['access', 'basicInfo'],
      description:
        'The minimum subscription tier required to access this post. Choose from predefined values.',

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
      type: 'image',
      group: 'media',
      icon: ImageIcon,
      description:
        'The main image for the post. Also displayed on social cards and search engine results.',
      name: 'coverImage',
      title: 'Cover Image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Alternative text for screenreaders.'
        })
      ],
      preview: {
        select: {
          imageUrl: 'asset.url',
          title: 'caption'
        }
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      title: 'Cover Video',
      name: 'coverVideo',
      group: 'media',
      type: 'video'
    }),

    defineField({
      name: 'filters',
      title: 'Tags',
      group: 'basicInfo',
      description:
        'Tags to categorize and filter posts. These should reference existing filter items.',

      type: 'array',
      of: [{ type: 'reference', to: { type: 'filterItem' } }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'downloadFiles',
      type: 'array',
      group: ['media', 'content'],
      title: 'Download Files',
      icon: DownloadIcon,
      description: 'Files available for download related to this post.',

      of: [
        defineArrayMember({
          name: 'fileAsset',
          type: 'object',
          description: 'An individual file that can be downloaded.',

          title: 'File Asset',
          fields: [
            defineField({
              name: 'fileTitle',
              type: 'string',
              title: 'Display name',
              description:
                'The display name of the file. This is how it will appear to users.',

              validation: (rule) =>
                rule.required().error('File display name is required')
            }),
            defineField({
              name: 'fileForDownload',
              type: 'file',
              description: 'The file to be downloaded.',
              title: 'File'
            })
          ],
          preview: {
            select: {
              title: 'fileTitle'
            },
            prepare({ title }) {
              return {
                title: title,
                media: DownloadIcon
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'pageContent',
      title: 'Page Content',
      group: 'content',
      description:
        'The main content of the post. It can include text, post content, and embedded PDFs.',

      type: 'array',
      of: [
        defineArrayMember({
          type: 'templateText',
          description: 'A text template for consistent formatting.'
        }),
        defineArrayMember({
          type: 'postContent',
          description: 'The main body of the post content.'
        }),
        defineArrayMember({
          type: 'pdfEmbed',
          description: 'Embed a PDF document within the post.'
        }),
        defineArrayMember({
          type: 'postFooter'
        })
      ]
    }),
    defineField({
      title: 'Hidden contextual tags',
      name: 'hiddenTags',
      type: 'text',
      rows: 3,
      description:
        'Hidden tags that are not displayed on the post but that are used for search (example: LennarDigital delay reverb fors)'
    })
  ],

  preview: {
    select: {
      title: 'title',
      artist: 'artist.name',
      media: 'coverImage'
    },
    prepare(selection) {
      const { artist } = selection
      return { ...selection, subtitle: artist && `by ${artist}` }
    }
  }
})
