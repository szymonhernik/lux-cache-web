import { HomeIcon, TiersIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricing',
  title: 'Pricing',
  type: 'document',
  icon: TiersIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: '(read only)',
      initialValue: 'pricing',
      readOnly: true,
      validation: (rule) => rule.required()
    }),
    // field for descriptions for each pricing plan

    defineField({
      title: 'Plans Features',
      name: 'plansFeatures',
      description: 'Descriptions for each pricing plan.',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Plan',
          type: 'object',
          icon: TiersIcon,
          name: 'plan',
          fields: [
            defineField({
              title: 'Plan Name',
              name: 'planName',
              type: 'string'
            }),
            defineField({
              type: 'blockContentSimple',
              description: 'Description of the plan features.',
              name: 'planDescription',
              title: 'Plan Features'
            })
          ]
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
        subtitle: 'Home',
        title
      }
    }
  }
})
