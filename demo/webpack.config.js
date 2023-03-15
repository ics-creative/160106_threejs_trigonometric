module.exports = {
  mode: "development",
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './src/Main.ts',
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/build`,
    // 出力ファイル名
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
      },
    ],
  },

  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: ['.ts', '.js', 'json'],
  },
  // ローカル開発用環境を立ち上げる
  // ブラウザで http://localhost:8081/ でアクセスできるようになる
  devServer: {
    static: {
      directory: 'build'
    },
    port: 8081,
  }
};
