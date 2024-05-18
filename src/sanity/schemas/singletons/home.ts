import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'highlight',
      description: 'The episode that will be highlighted on the home page.',
      title: 'Highglighted Episode',
      type: 'reference',
      to: { type: 'post' },
      validation: (rule) => rule.required()
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
