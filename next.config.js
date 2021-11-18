const isDevelop = process.env.NODE_ENV === "development"
const isPreview = process.env.NODE_ENV === "preview"

module.exports = {
  webpack5: false,
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
    url : isDevelop 
      ? 'http://localhost:3060' 
      : isPreview 
        ? process.env.API_ENDPOINT
        : `https://lifenote.c` 
  }
};

