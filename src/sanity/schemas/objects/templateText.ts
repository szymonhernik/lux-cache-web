import { InsertAboveIcon } from '@sanity/icons'
import { defineType } from 'sanity'

export default defineType({
  name: 'templateText',
  title: 'Template Texts',

  icon: InsertAboveIcon,

  type: 'reference',
  to: { type: 'templates' }
})
