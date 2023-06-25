import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const metadataImage = process.env.NEXT_PUBLIC_METADATA_IMAGE;
  const metadataUrl = process.env.NEXT_PUBLIC_METADATA_URL;

  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Kaiju Labs help game developers to create Web3 games with zero blockchain knowledge by providing an easy to use Wallet, SDK, and Infrastructure." />
        <meta name="image" content="/image.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="Kaiju Arcade 2048 | Kaiju Web3 Labs" />
        <meta property="og:description" content="Kaiju Labs help game developers to create Web3 games with zero blockchain knowledge by providing an easy to use Wallet, SDK, and Infrastructure." />
        <meta property="og:image" content={metadataImage} />
        <meta property="og:image:alt" content="Kaiju Arcade 2048" />
        <meta property="og:url" content={metadataUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kaiju Arcade 2048" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kaiju Arcade 2048 | Kaiju Web3 Labs" />
        <meta name="twitter:description" content="Kaiju Labs help game developers to create Web3 games with zero blockchain knowledge by providing an easy to use Wallet, SDK, and Infrastructure." />
        <meta name="twitter:image" content={metadataImage} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
