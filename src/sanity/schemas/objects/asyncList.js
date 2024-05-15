import { defineType } from 'sanity'
import { AsyncListInput } from './inputComponent'

export default defineType({
  title: 'Async List',
  name: 'asyncList',
  type: 'string',
  options: {
    list: [], // <-- list must be an empty array initially to avoid errors
    url: '', // <-- the url you want to fetch
    formatResponse: (data) => {} // <-- a function to transform the data to match the schema requirements: { title, value }
  },
  components: {
    input: AsyncListInput
  }
})
