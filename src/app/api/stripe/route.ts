import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    })
    console.log('response', response)

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching data from Stripe' },
      { status: 500 }
    )
  }
}
