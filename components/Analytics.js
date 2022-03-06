// @ts-check
import Script from 'next/script'
import { GA_TRACKING_ID } from '../lib/gtag'

function Analytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
        }}
      />
    </>
  )
}

export default Analytics
