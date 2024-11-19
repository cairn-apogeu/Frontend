import { ClerkProvider } from '@clerk/nextjs';

const clerkPublishableKey = 'YOUR_PUBLISHABLE_KEY'; // Substitua pelo seu publishable key do Clerk

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
