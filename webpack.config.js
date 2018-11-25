module.exports = {
    node: {
      crypto: true,
      http: true,
      https: true,
      os: true,
      vm: true,
      stream: true
    },
    externals: {
        fs: 'commonjs fs',
        path: 'commonjs path',
        crypto: 'commonjs crypto'
      }
  }