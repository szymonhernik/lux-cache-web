/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { locate } from '@/sanity/plugins/locate'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { schema } from '@/sanity/schema'
import { presentationTool } from 'sanity/presentation'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'

import page from '@/sanity/schemas/documents/page'
import project from '@/sanity/schemas/documents/project'

import post from '@/sanity/schemas/documents/post'

import blockContent from '@/sanity/schemas/objects/blockContent'
import { pageStructure } from '@/sanity/plugins/settings'

import artist from '@/sanity/schemas/documents/artist'
import filterItem from '@/sanity/schemas/documents/filters/filterItem'
import filterGroup from '@/sanity/schemas/documents/filters/filterGroup'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: [
      // Singletons
      home,
      settings,

      // Documents
      post,
      page,
      artist,
      filterItem,
      filterGroup,

      // Objects
      blockContent
    ]
  },
  plugins: [
    structureTool({
      structure: pageStructure(
        //singletons
        [home, settings],
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
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion })
  ]
})
