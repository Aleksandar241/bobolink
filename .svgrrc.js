module.exports = {
  icon: true,
  expandProps: true,
  native: true,
  outDir: 'src/theme/icons',
  typescript: true,
  prettier: false,
  allExtensions: true,
  isTSX: true,
  index: false,
  replaceAttrValues: {
    '#000': 'currentColor',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Keep viewBox so the icon scales correctly.
            removeViewBox: false,
          },
        },
      },
      {
        // `react-native-svg` doesn't support these web-only attributes.
        name: 'removeAttrs',
        params: {
          // Note: SVGO sees the raw SVG attribute names (e.g. `xml:space`),
          // not the JSX-renamed ones (e.g. `xmlSpace`).
          // SVGO's removeAttrs plugin uses `:` as a pattern separator by default,
          // which conflicts with namespaced attributes like `xml:space`.
          // Switching to a different separator lets us match those safely.
          elemSeparator: '|',
          attrs: ['xmlns', 'xmlns:xlink', 'xml:space'],
        },
      },
    ],
  },
};
