import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
// import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../styles/theme';

import {ServerStyleSheets as MaterialUIStyleSheets} from '@material-ui/core/styles';
import {ServerStyleSheet as StyledComponentsStyleSheets} from "styled-components";

export default class MyDocument extends Document {
  render() {
      return (
          <Html lang="ja">
              <Head/>
              <body>
              <Main/>
              <NextScript/>
              </body>
          </Html>
      );
  }
}

// export default class MyDocument extends Document {
//   render() {
//     return (
//       <Html lang="ja">
//         <Head>
//           {/* PWA primary color */}
//           <meta name="theme-color" content={theme.palette.primary.main} />
//           <link
//             rel="stylesheet"
//             href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
//           />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const materialUISheets = new MaterialUIStyleSheets()
  const styledComponentsSheets = new StyledComponentsStyleSheets()
  const originalRenderPage = ctx.renderPage

  // const sheets = new ServerStyleSheets();
  // const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => styledComponentsSheets.collectStyles(
                materialUISheets.collect(<App {...props} />)
            ),
        })

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: (
            <>
                {initialProps.styles}
                {styledComponentsSheets.getStyleElement()}
            </>
        ),
    }
} finally {
    styledComponentsSheets.seal()
}


  // ctx.renderPage = () =>
  //   originalRenderPage({
  //     enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  //   });

  // const initialProps = await Document.getInitialProps(ctx);

  // return {
  //   ...initialProps,
  //   // Styles fragment is rendered after the app and page rendering finish.
  //   styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  // };
};