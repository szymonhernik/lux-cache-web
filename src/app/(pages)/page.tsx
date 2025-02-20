// import { unstable_noStore } from 'next/cache'
import SplashPage from './(public)/_components/SplashPage'

// export const dynamic =
//   process.env.NODE_ENV === 'production' ? 'force-dynamic' : undefined

export default async function Page() {
  // Only use unstable_noStore in production
  // if (process.env.NODE_ENV === 'production') {
  //   unstable_noStore()
  // }

  // In development, you can work on your new version
  // if (process.env.NODE_ENV === 'development') {
  //   return <SplashPage />
  // }

  // Production version
  // return <HomePage data={null} />
  return <SplashPage />
}
