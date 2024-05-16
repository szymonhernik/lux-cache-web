// @ts-nocheck
/**
 * This plugin contains all the logic for setting up the singletons
 */

import {
  BlockElementIcon,
  DocumentsIcon,
  FilterIcon,
  ProjectsIcon,
  SchemaIcon,
  TagsIcon,
  TiersIcon,
  UsersIcon
} from '@sanity/icons'
import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/structure'

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === 'global') {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId)
          )
        }

        return prev
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== 'duplicate')
        }

        return prev
      }
    }
  }
}

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (
  typeDefArray: DocumentDefinition[],
  filterDefArray: DocumentDefinition[]
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name)
        )
    })

    const pagesItem = S.listItem()
      .title('Pages')
      .icon(DocumentsIcon)
      .child(S.documentTypeList('page').title('Pages'))

    const artistsItem = S.listItem()
      .title('Artists')
      .icon(UsersIcon)
      .child(S.documentTypeList('artist').title('Artists'))

    // Filter group items
    const filterGroupItems = filterDefArray.map((filterDef) => {
      return S.listItem()
        .title(filterDef.title)
        .icon(filterDef.icon)
        .child(S.documentTypeList(filterDef.name).title(filterDef.title))
    })

    const filterGroupStructure = S.listItem()
      .title('Filters')
      .icon(FilterIcon)
      .child(S.list().title('Manage Filters').items(filterGroupItems))

    // Define filtering for posts by tag or author
    const filteredPostsByTag = S.listItem()
      .title('Posts By Tag')
      .icon(TagsIcon)
      .child(
        S.documentTypeList('filterItem')
          .title('Posts by Tag')
          .child((filterId) =>
            S.documentList()
              .title('Posts')
              .filter('_type == "post" && $filterId in filters[]._ref')
              .params({ filterId })
          )
      )

    const filteredPostsByAuthor = S.listItem()
      .title('Posts By Author')
      .icon(UsersIcon)
      .child(
        S.documentTypeList('artist')
          .title('Posts by Author')
          .child((artistId) =>
            S.documentList()
              .title('Posts')
              .filter('_type == "post" && $artistId == artist._ref')
              .params({ artistId })
          )
      )
    const filteredPostsBySeries = S.listItem()
      .title('Posts By Series')
      .icon(SchemaIcon)
      .child(
        S.documentTypeList('series')
          .title('Posts by Series')
          .child((seriesId) =>
            S.documentList()
              .title('Posts')
              .filter('_type == "post" && $seriesId == series._ref')
              .params({ seriesId })
          )
      )

    const filteredPosts = S.listItem()
      .title('Filtered Posts')
      .icon(FilterIcon)
      .child(
        S.list()
          .title('Filters')
          .items([
            filteredPostsByTag,
            filteredPostsByAuthor,
            filteredPostsBySeries
          ])
      )
    const allPosts = S.listItem().title('All Posts').icon(ProjectsIcon).child(
      /* Create a list of all posts */
      S.documentList().title('All Posts').filter('_type == "post"')
    )
    const templates = S.listItem()
      .title('Templates')
      .icon(BlockElementIcon)
      .child(S.documentTypeList('templates').title('Templates'))
    const plans = S.listItem()
      .title('Plans (Developer Only)')
      .icon(TiersIcon)
      .child(S.documentTypeList('plan').title('Plan'))
    const series = S.listItem()
      .title('Series')
      .icon(SchemaIcon)
      .child(S.documentTypeList('series').title('Series'))

    return S.list()
      .title('Content')
      .items([
        ...singletonItems,
        S.divider(),
        allPosts,
        filteredPosts,
        S.divider(),
        pagesItem,
        S.divider(),
        filterGroupStructure,
        artistsItem,
        series,
        S.divider(),
        templates
        // S.divider(),
        // plans

        // ...defaultListItems
      ])
  }
}
