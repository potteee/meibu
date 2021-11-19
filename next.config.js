const isDevelop = process.env.NEXT_PUBLIC_NODE_ENV === "development"
const isPreview = process.env.NEXT_PUBLIC_NODE_ENV === "preview"

console.log(process.env.NEXT_PUBLIC_NODE_ENV+"+NODE_ENV")

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
        ? process.env.NEXT_PUBLIC_API_ENDPOINT
        : process.env.NEXT_PUBLIC_URL 
        // : `https://lifenote.ch`  
  }
};

