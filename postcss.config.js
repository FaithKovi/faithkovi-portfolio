module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      config: './tailwind.config.js', // make sure this path is correct
    }),
    require('autoprefixer'),
  ],
};
