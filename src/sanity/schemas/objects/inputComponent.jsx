'use client'
import { getStripe } from '@/utils/stripe/client'
import { retrieveProducts } from '@/utils/stripe/server'
import { useState, useEffect } from 'react'

// const product = await stripe.products.retrieve('prod_NWjs8kKbJWmuuc')

export const AsyncListInput = (props) => {
  const [listItems, setListItems] = useState([])
  const [productsFetched, setProducts] = useState(null)
  const { schemaType, renderDefault } = props
  const { options } = schemaType
  const { url, formatResponse } = options

  useEffect(() => {
    // declare the async data fetching function

    const fetchData = async () => {
      let products
      if (!productsFetched) {
        products = await retrieveProducts()
      }
      setProducts(products)
      const formattedProducts = formatResponse(products)
      // Add the new product to the formattedProducts array
      const newProduct = { title: 'Free', value: 'Free' }
      formattedProducts.push(newProduct)
      setListItems(formattedProducts)
      console.log('formattedProducts', formattedProducts)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [formatResponse])

  return renderDefault({
    ...props,
    schemaType: { ...schemaType, options: { ...options, list: listItems } }
  })
}
