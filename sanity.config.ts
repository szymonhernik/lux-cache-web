/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { locate } from '@/sanity/plugins/locate'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { muxInput } from 'sanity-plugin-mux-input'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from '@/sanity/env'

import { presentationTool } from 'sanity/presentation'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'

import page from '@/sanity/schemas/documents/page'

import post from '@/sanity/schemas/documents/post'

import blockContent from '@/sanity/schemas/objects/blockContent'
import { pageStructure } from '@/sanity/plugins/settings'

import artist from '@/sanity/schemas/documents/artist'
import filterItem from '@/sanity/schemas/documents/filters/filterItem'
import filterGroup from '@/sanity/schemas/documents/filters/filterGroup'
import templates from '@/sanity/schemas/documents/templates'
import mainBody from '@/sanity/schemas/objects/mainBody'

import blockContentSimple from '@/sanity/schemas/objects/blockContentSimple'
import faq from '@/sanity/schemas/objects/faq'
import mentorsGallery from '@/sanity/schemas/objects/mentorsGallery'
import series from '@/sanity/schemas/documents/series'
import templateText from '@/sanity/schemas/objects/templateText'
import blockContentAdvanced from '@/sanity/schemas/objects/blockContentAdvanced'
import postContent from '@/sanity/schemas/objects/postContent'
import pdfEmbed from '@/sanity/schemas/objects/pdfEmbed'
import video from '@/sanity/schemas/objects/video'
import audioInline from '@/sanity/schemas/objects/audioInline'
import { youtube } from '@/sanity/schemas/objects/youTubeType'
import { spotify } from '@/sanity/schemas/objects/spotifyType'
import postFooter from '@/sanity/schemas/objects/postFooter'
import pricing from '@/sanity/schemas/singletons/pricing'
import introText from '@/sanity/schemas/objects/introText'
import coverVideo from '@/sanity/schemas/objects/coverVideo'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { getURL } from '@/utils/helpers'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  document: {
    // prev is the result from previous plugins and thus can be composed
    productionUrl: async (prev, context) => {
      // context includes the client and other details
      const { getClient, dataset, document } = context
      const client = getClient({ apiVersion: '2023-06-21' })

      if (document._type === 'post') {
        const slug = await client.fetch(
          `*[_type == 'post' && _id == $postId][0].slug.current`,
          { postId: document._id }
        )

        const url = getURL(
          `/studio/presentation/post/${document._id}?preview=/post/${slug}`
        )
        // http://localhost:3000/studio/presentation/post/5b38fdf8-aae7-4e0c-a196-407e5e6989b7?preview=/post/delve-james-rand
        return url
      }

      return prev
    }
  },
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: [
      // Singletons
      home,
      settings,
      pricing,

      // Documents
      post,
      page,
      artist,
      filterItem,
      filterGroup,
      templates,
      series,

      // Objects
      blockContent,
      introText,
      blockContentSimple,
      mainBody,
      faq,
      mentorsGallery,
      templateText,
      blockContentAdvanced,
      postContent,
      pdfEmbed,
      coverVideo,
      video,
      audioInline,
      youtube,
      spotify,
      postFooter
    ]
  },
  plugins: [
    structureTool({
      structure: pageStructure(
        //singletons
        [home, pricing, settings],
        //filter groups
        [filterItem, filterGroup]
      )
    }),

    presentationTool({
      locate,
      previewUrl: {
        previewMode: {
          enable: '/api/draft'
        }
      }
    }),
    muxInput(),
    cloudinarySchemaPlugin(),

    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion })
  ]
})
