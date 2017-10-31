```# 1. Back-end Set-up

## 1.1 MongoDB Install

- [mLab Hosting service](http://poiemaweb.com/mongdb-basics#43-mlab-hosting-service)

## 1.2 Dependency

- express
- body-parser
- dotenv
- mongoose
- nodemon

```bash
$ npm install nodemon -g
$ cd <project>
$ npm init --yes
$ npm install express body-parser dotenv mongoose
```

## 1.3 Configuration

.env

```bash
# port number
PORT=4500
# MongoDB URI & User/Password
MONGO_URI=mongodb://localhost/<db-name>
# mlab의 경우
# MONGO_URI=mongodb://<userid>:<password>@<database>:<port>/<db-name>
```

package.json

```json
  ...
  "scripts": {
    "start": "nodemon server.js"
  },
```

## 1.4 디렉터리 구조

```bash
Project/
├── models/
│   └── todo.js
├── routes/
│   └── todos.js
├── .env
├── server.js
└── pakage.json
```

## 1.5 APIs

### 1.5.1 Find All

```
GET /todos
```

### 1.5.2 Create new todo document

```
POST /todos
```

### 1.5.3 Update All

```
PATCH /todos
```

### 1.5.4 Update by id

```
PATCH /todos/:id
```

### 1.5.5 Delete by id

```
DELETE /todos/:id
```

### 1.5.6 Delete by completed

```
DELETE /todos/completed
```

## 1.6 Serve

```bash
$ npm start
```

# 2. Front-end Set-up

## 2.1 Dependency

- Webpack
- Babel
- Babel polyfill
- Sass
- axios

```bash
# babel
$ npm install babel-cli babel-preset-env --save-dev
# polyfill은 소스코드 이전에 실행되어야 한다. 따라서 devDependency가 아닌 dependency로 설치하여야 한다.
# polyfill 적용: js entry point의 가장 선두에 import 또는 webpack.config.js의 bundle 프로퍼티에 추가
$ npm install babel-polyfill

# webpack
$ npm install webpack babel-loader node-sass css-loader sass-loader style-loader file-loader extract-text-webpack-plugin --save-dev

# axios
$ npm install axios
```

## 2.2 Configuration

webpack.config.js

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/js/app.js', './src/sass/style.scss']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader?outputStyle=expanded']
        }),
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // css내의 path: publicPath + outputPath => ../assets/fonts/
              publicPath: '../',
              outputPath: 'assets/fonts/'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'css/[name].bundle.css',
      allChunks: true
    })
  ],
  devtool: 'source-map'
};
```

package.json

```json
  ...
  "scripts": {
    "start": "nodemon server.js",
    "build": "webpack -w"
  },
```

## 2.3 디렉터리 구조

```bash
Project/
├── models/
│   └── todo.js
├── routes/
│   └── todos.js
├── src
│   ├── js
│   │   └── app.js
│   └── sass
│       ├── partial/
│       └── style.scss
├── .env
├── pakage.json
├── server.js
└── webpack.config.js
```

## 2.4 axios을 사용한 API 호출

- [axios](https://github.com/axios/axios)

```javascript
// GET ALL
axios.get('/todos')
  .then(res => console.log(res))
  .catch(err => console.log(err));

// POST
axios.post('/todos', payload)
  .then(res => console.log(res))
  .catch(err => console.log(err));

// PATCH
axios.patch(`/todos/${id}`, payload)
  .then(res => console.log(res))
  .catch(err => console.log(err));

// PATCH ALL
axios.patch('/todos', payload)
  .then(res => console.log(res))
  .catch(err => console.log(err));

//DELETE
axios.delete(`/todos/${id}`)
  .then(res => console.log(res))
  .catch(err => console.log(err));
```

## 2.5 Build

```bash
$ npm run build
```

- [http://localhost:4500](http://localhost:4500)
```