import { TiersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'plan',
  title: 'Plans',
  type: 'document',
  icon: TiersIcon,
  fields: [
    defineField({
      name: 'plan',
      title: 'Plan name',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'index',
      title: 'Index',
      description:
        'EDIT ONLY UPON CONSULTATION WITH THE DEVELOPER! Tier expressed in a number. 0 is free plan, 1 is the lowest tier (supporter), 2 is the next tier (subscriber) and so on.',
      type: 'number',
      validation: (rule) => rule.required()
    })
  ]
})
