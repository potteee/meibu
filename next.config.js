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
    url : isDevelop ? 'http://localhost:3060' : 'VERCEL_URL'
  }
};

