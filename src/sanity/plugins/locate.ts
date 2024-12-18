import { map } from 'rxjs'
import {
  DocumentLocationResolver
} from 'sanity/presentation'


// export const locate: DocumentLocationResolver = (params, context) => {
//   if (params.type === 'settings') {
//     return {
//       message: 'This document is used on all pages',
//       tone: 'caution'
//     } satisfies DocumentLocationsState
//   }

//   if (
//     params.type === 'post' ||
//     params.type === 'home' ||
//     params.type === 'page'
//   ) {
//     const doc$ = context.documentStore.listenQuery(
//       `*[_id==$id || references($id)]{_type,slug,title}`,
//       params,
//       { perspective: 'previewDrafts' }
//     ) as Observable<
//       | {
//           _type: string
//           slug: { current: string }
//           title: string | null
//         }[]
//       | null
//     >
//     return doc$.pipe(
//       map((docs) => {
//         const isReferencedBySettings = docs?.some(
//           (doc) => doc._type === 'settings'
//         )
//         switch (params.type) {
//           case 'home':
//             return isReferencedBySettings
//               ? ({
//                   locations: [
//                     {
//                       title:
//                         docs?.find((doc) => doc._type === 'home')?.title ||
//                         'Home',
//                       href: resolveHref(params.type)!
//                     }
//                   ],
//                   tone: 'positive',
//                   message: 'This document is used to render the front page'
//                 } satisfies DocumentLocationsState)
//               : ({
//                   tone: 'critical',
//                   message: `The top menu isn't linking to the home page. This might make it difficult for visitors to navigate your site.`
//                 } satisfies DocumentLocationsState)
//           case 'page':
//             return {
//               locations: docs
//                 ?.map((doc) => {
//                   const href = resolveHref(doc._type, doc?.slug?.current)
//                   return {
//                     title: doc?.title || 'Untitled',
//                     href: href!
//                   }
//                 })
//                 .filter((doc) => doc.href !== undefined),
//               tone: isReferencedBySettings ? 'positive' : 'critical',
//               message: isReferencedBySettings
//                 ? 'The top menu is linking to this page'
//                 : "The top menu isn't linking to this page. It can still be accessed if the visitor knows the URL."
//             } satisfies DocumentLocationsState
//           case 'post':
//             return {
//               locations: docs
//                 ?.map((doc) => {
//                   const href = resolveHref(doc._type, doc?.slug?.current)
//                   console.log('TYPE:', doc._type)

//                   return {
//                     title: doc?.title || 'Untitled',
//                     href: href!
//                   }
//                 })
//                 .filter((doc) => doc.href !== undefined),
//               tone: isReferencedBySettings ? 'caution' : undefined,
//               message: isReferencedBySettings
//                 ? 'This document is used on all pages as it is in the top menu'
//                 : undefined
//             } satisfies DocumentLocationsState
//           default:
//             return {
//               message: 'Unable to map document type to locations',
//               tone: 'critical'
//             } satisfies DocumentLocationsState
//         }
//       })
//     )
//   }

//   return null
// }

// Pass 'context' as the second argument
export const locate: DocumentLocationResolver = (params, context) => {
  // Set up locations for post documents
  if (params.type === 'post') {
    // Subscribe to the latest slug and title
    const doc$ = context.documentStore.listenQuery(
      `*[_id == $id][0]{slug,title}`,
      params,
      { perspective: 'previewDrafts' } // returns a draft article if it exists
    )
    // Return a streaming list of locations
    return doc$.pipe(
      map((doc) => {
        // If the document doesn't exist or have a slug, return null
        if (!doc || !doc.slug?.current) {
          return null
        }
        return {
          locations: [
            {
              title: doc.title || 'Untitled',
              href: `${params.type}/${doc.slug.current}`
            },
            {
              title: 'Browse',
              href: '/browse'
            }
          ]
        }
      })
    )
  }
  return null
}
