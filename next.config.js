const isDevelop = process.env.NODE_ENV === "development"

module.exports = {
  webpack: config => {
    config.node = {
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      dns: 'empty',
      tls: 'empty',
    };
    return config;
  },
  env : {
    url : isDevelop ? 'NEXT_PUBLIC_VERCEL_URL' : 'NEXT_PUBLIC_VERCEL_URL'
    // url : isDevelop ? 'http://localhost:3060' : 'NEXT_PUBLIC_VERCEL_URL'
    // url : isDevelop ? 'http://localhost:3060' : 'VERCEL_URL'
  }
};

