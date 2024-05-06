// @ts-nocheck
/**
 * This plugin contains all the logic for setting up the singletons
 */

import {
  DocumentsIcon,
  FilterIcon,
  ProjectsIcon,
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

    // Filter group items
    const filterGroupItems = filterDefArray.map((filterDef) => {
      return S.listItem()
        .title(filterDef.title)
        .icon(FilterIcon)
        .child(S.documentTypeList(filterDef.name).title(filterDef.title))
    })

    // The default root list items
    // Filter out both singletons and filter groups
    // const excludedItems = typeDefArray
    //   .map((singleton) => singleton.name)
    //   .concat(filterDefArray.map((group) => group.name))
    // const defaultListItems = S.documentTypeListItems().filter(
    //   (listItem) => !excludedItems.includes(listItem.getId())
    // )
    // Define item for 'Posts'
    const postsItem = S.listItem()
      .title('Posts')
      .icon(ProjectsIcon)
      .child(S.documentTypeList('post').title('Posts'))

    const pagesItem = S.listItem()
      .title('Pages')
      .icon(DocumentsIcon)
      .child(S.documentTypeList('page').title('Pages'))

    const artistsItem = S.listItem()
      .title('Artists')
      .icon(UsersIcon)
      .child(S.documentTypeList('artist').title('Artists'))

    const filterGroupStructure = S.listItem()
      .title('Filters')
      .icon(FilterIcon)
      .child(S.list().title('Filter groups').items(filterGroupItems))

    return S.list()
      .title('Content')
      .items([
        ...singletonItems,
        S.divider(),
        postsItem,
        S.divider(),
        pagesItem,
        S.divider(),
        filterGroupStructure,
        artistsItem

        // ...defaultListItems
      ])
  }
}
