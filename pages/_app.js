import Head from 'next/head'
import { SessionProvider } from "next-auth/react"

import '/source/styles/globals.css'

export default function _app({Component, pageProps: { session, ...pageProps }}) {
  return (
    <>
      <Head>
        <title>Next CMS</title>
        <meta name="description" content="Next App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}
