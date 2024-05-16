import { DocumentPdfIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'pdfEmbed',
  title: 'PDF Embed',
  type: 'object',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      title: 'PDF File',
      name: 'pdfFile',
      type: 'file'
    })
  ],
  preview: {
    select: {
      //   title: 'heading',
    },
    prepare() {
      return {
        title: 'PDF Embed'
      }
    }
  }
})
