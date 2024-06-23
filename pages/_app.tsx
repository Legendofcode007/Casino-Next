import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from 'react-query'
import {  Layout } from "../src/user/containers/Layout"

const queryClient = new QueryClient({
  defaultOptions:{
  }
})
function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    if (router.pathname.indexOf("/admin") == -1) {
      require('../styles/index.scss')
      require("bootstrap-icons/font/bootstrap-icons.css")
    }
  }, []);
  
  return (
    <>
      <SessionProvider session={pageProps.session}>
        {router.pathname.indexOf("/admin") ? 
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryClientProvider>
        :<Component {...pageProps} />}
      </SessionProvider>
    </>
  );
}

export default MyApp;
