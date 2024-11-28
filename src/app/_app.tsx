import { ClerkProvider } from '@clerk/nextjs';

const clerkPublishableKey = 'pk_test_ZXF1aXBwZWQtamF3ZmlzaC0xMi5jbGVyay5hY2NvdW50cy5kZXYk'; // Substitua pelo seu publishable key do Clerk

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
