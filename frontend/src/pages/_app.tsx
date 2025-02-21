import "@/styles/globals.css";
import { ChakraProvider, defaultSystem} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <ChakraProvider value={defaultSystem}>
      <Component {...pageProps} />
      <Toaster />
    </ChakraProvider> 
  )
  }
