import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './schemas/objects/blockContent'
import category from './schemaTypes/category'
import post from './schemas/documents/post'
import author from './schemaTypes/author'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, category, blockContent]
}
