import { Description } from '@radix-ui/react-toast'
import { InsertAboveIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'templateText',
  title: 'Template Texts',

  icon: InsertAboveIcon,

  type: 'reference',
  to: { type: 'templates' }
})
