const path = require('path'); // Підключаємо модуль для роботи з шляхами файлів
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Підключаємо плагін для генерації HTML файлів
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Підключаємо плагін для очищення папки dist перед кожною збіркою
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Підключаємо плагін для копіювання файлів та папок
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Підключаємо плагін для вилучення CSS в окремі файли
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // Підключаємо плагін для мінімізації CSS
const TerserPlugin = require('terser-webpack-plugin'); // Підключаємо плагін для мінімізації JavaScript
const EslintWebpackPlugin = require('eslint-webpack-plugin'); // Підключаємо плагін для інтеграції ESLint

const IS_DEV = process.env.NODE_ENV === 'development'; // Визначаємо, чи в режимі розробки ми знаходимося
const IS_PROD = !IS_DEV; // Визначаємо, чи в режимі продакшн ми знаходимося

const optimization = () => { // Функція для налаштування оптимізації
  return {
    splitChunks: {
      chunks: 'all', // Розбиваємо код на частини для оптимального завантаження
    },
    minimizer: [
      new CssMinimizerWebpackPlugin(), // Додаємо мінімізацію CSS
      new TerserPlugin(), // Додаємо мінімізацію JavaScript
    ]
  }
} 

const filename = (ext) => { // Функція для генерації назв файлів
  return IS_DEV ? 
      `[name].${ext}` : // Якщо в режимі розробки, назва без хешу
      `[name].[contenthash].${ext}`; // Якщо в режимі продакшн, назва з хешем
}

const cssLoaders = (extra) => { // Функція для генерації лоадерів CSS
  const loaders = [
    { loader: MiniCssExtractPlugin.loader }, // Використовуємо лоадер для вилучення CSS
    'css-loader', // Лоадер для інтерпретації @import і url()
  ];

if (extra) {
  loaders.push(extra); // Якщо є додаткові лоадери, додаємо їх
}
  return loaders;
}

const jsLoaders = (extra) => { // Функція для генерації лоадерів JavaScript
  const loaders = {
    loader: "babel-loader", // Використовуємо Babel для транспіляції JavaScript
    options: {
      presets: [
        '@babel/preset-env', // Встановлюємо пресет для транспіляції ES6+
      ]
    }
  }

  if (extra) {
    loaders.options.presets.push(extra); // Якщо є додаткові пресети, додаємо їх
  }

  return loaders;
}

const setPlugins = () => { // Функція для налаштування плагінів
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html' // Встановлюємо шаблон для HTML файлу
    }),
    new CleanWebpackPlugin(), // Активуємо очищення папки dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname,'src/assets/favicon/favicon.ico'), // Визначаємо шлях до фавікону
          to: path.resolve(__dirname, 'docs/assets/favicon'), // Визначаємо, куди копіювати
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'), // Встановлюємо назву для CSS файлу
    }),
    new EslintWebpackPlugin({
      extensions: ['js'], // Вказуємо, що лінтувати лише JS файли
      fix: true // Вмикаємо автоматичне виправлення помилок
    }),
  ]

  return plugins;
}

module.exports = {
  context: path.resolve(__dirname,'src'), // Встановлюємо базову папку для точок входу
  mode: 'development', // Встановлюємо режим збірки
  entry: {
    main: './index.js', // Основна точка входу
    stat: './statistics.ts', // Додаткова точка входу
  },
  target: 'web', // Вказуємо, що збірка призначена для веб
  output: {
    path: path.resolve(__dirname, 'docs'), // Вказуємо папку для результатів збірки
    filename: filename('js'), // Встановлюємо шаблон імені для вихідних файлів JavaScript
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'), // Встановлюємо аліас для зручності імпорту
      '@css': path.resolve(__dirname,'src/css'), // Аліас для CSS файлів
      '@assets': path.resolve(__dirname,'src/assets'), // Аліас для активів
    },
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx',], // Вказуємо розширення файлів для обробки
  },
  optimization: optimization(), // Використовуємо налаштування оптимізації
  devServer: {
    port: 4200, // Встановлюємо порт для локального серверу
    hot: false, // Вимикаємо гарячу заміну модулів
  },
  devtool: IS_DEV ? 'source-map' : false, // Встановлюємо використання source maps в режимі розробки
  plugins: setPlugins(), // Використовуємо налаштовані плагіни
  module: {
    rules: [ // Встановлюємо правила для модулів
      {
        test: /\.m?js$/, // Правило для файлів JavaScript
        exclude: /node_modules/, // Виключаємо обробку файлів з node_modules
        use: jsLoaders(), // Використовуємо лоадери для JavaScript
      },
      {
        test: /\.ts$/, // Правило для файлів TypeScript
        exclude: /node_modules/, // Виключаємо обробку файлів з node_modules
        use: jsLoaders('@babel/preset-typescript'), // Використовуємо лоадери для TypeScript
      },
      {
        test: /\.css$/, // Правило для CSS файлів
        use: cssLoaders(), // Використовуємо лоадери для CSS
      },
      {
        test: /\.less$/, // Правило для LESS файлів
        use: cssLoaders('less-loader'), // Використовуємо лоадери для LESS
      },
      {
        test: /\.s[ac]ss$/, // Правило для SASS/SCSS файлів
        use: cssLoaders('sass-loader'), // Використовуємо лоадери для SASS/SCSS
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i, // Правило для зображень
        type: 'asset/resource', // Використовуємо ресурси активів
        generator: {
          filename: 'assets/images/[name].[hash][ext]', // Встановлюємо шаблон для імені файлів зображень
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/i, // Правило для шрифтів
        type: 'asset/resource', // Використовуємо ресурси активів
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]', // Встановлюємо шаблон для імені файлів шрифтів
        },
      },
    ],
  }
}