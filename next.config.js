const isDevelop = process.env.NEXT_PUBLIC_NODE_ENV === "development"
const isPreview = process.env.NEXT_PUBLIC_NODE_ENV === "preview"

console.log(process.env.NEXT_PUBLIC_NODE_ENV+"+NODE_ENV")

module.exports = {
  // // webpack5: false,
  // webpack: config => {
  //   config.node = {
  //     fs: 'empty',
  //     child_process: 'empty',
  //     net: 'empty',
  //     dns: 'empty',
  //     tls: 'empty',
  //     optimizeFileTracing: false
  //   };
  //   return config;
// },
  future: { webpack5: true },
  webpack: function (config, {isServer}) {
    // console.log(options.webpack.version); // 4.44.1
    config.experiments = {};
    // if (!isServer) {
    //   config.node = {
    //     fs: 'empty',
    //     child_process: 'empty',
    //     net: 'empty',
    //     dns: 'empty',
    //     tls: 'empty',
    //   };
    // }
    return config;
  },
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // 注意: 上記で webpack を提供しているので、それを `require` するべきではない
  //   // webpack の設定のカスタマイズを実行する
  //   // 重要: 変更された設定を返す
  //   // config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
  //   // config.optimizeFileTracing = false;
  //   config.node = {
  //     fs: false,
  //     child_process: false,
  //     net: false,
  //     dns: false,
  //     tls: false,
  //   };
  //   return config;
  // },
  // webpackDevMiddleware: config => {
  //   // webpack dev middleware の設定のカスタマイズを実行する
  //   // 重要: 変更された設定を返す
  //   return config;
  // },
  // optimizeFileTracing : false,
  env : {
    url : isDevelop 
      ? 'http://localhost:3060' 
      : isPreview 
        // ? process.env.NEXT_PUBLIC_API_ENDPOINT
        // ? `https://lifenote.ch`
        ? 'http://'+process.env.VERCEL_URL
        // : process.env.NEXT_PUBLIC_URL 
        // : process.env.VERCEL_URL
        : `https://lifenote.ch`
  }
};

