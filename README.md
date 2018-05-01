# React Range Slider

[![npm version](https://badge.fury.io/js/rc-range-slider.svg)](https://badge.fury.io/js/rc-range-slider)  [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![rc-range-slider](http://img.shields.io/npm/dm/rc-range-slider.svg)](https://www.npmjs.com/package/rc-range-slider) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ecmadao/rc-range-slider/master/LICENSE)

[![NPM](https://nodei.co/npm/rc-range-slider.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/rc-range-slider)

A tooltip component for react.

## Screenshot

![rc-range-slider](./screenshots/rc-range-slider.gif)

## Live demo

Click here: [https://ecmadao.github.io/rc-range-slider](https://ecmadao.github.io/rc-range-slider)

## Install

```bash
$ npm i rc-range-slider --save
```

### Build config

- Webpack 3.x config example

```javascript
// webpack config file

// loaders
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    config: {
      path: path.join(__dirname, 'postcss.config.js')
    }
  }
};
const cssModulesLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        sourceMaps: true,
        importLoaders: 1,
        localIdentName: '[name]__[local]___[hash:base64:5]'
      }
    },
    postcssLoader
  ],
});

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /rc-range-slider|rc-tipso/,
        loaders: cssModulesLoader
      }
    ]
  }
};
```

- Webpack 1.x config example

```javascript
const webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: /rc-range-slider|rc-tipso/,
        loaders: cssLoaders
      }
    ]
  },
  postcss: () => {
    return [
      require('postcss-cssnext')
    ]
  }
};
```

## Usage

```javascript
import Slider from 'rc-range-slider';

// ...

render() {
  return (
    <Slider value={[15, 35]} minRange={5}/>
  )
}
```

## Example

Click [here](./examples/SliderWrapper.jsx) to see tipso usage examples.

## Api

| name           | type                                    | default    | description                              |
| -------------- | --------------------------------------- | ---------- | ---------------------------------------- |
| tipFormatter   | `PropTypes.func`                        | `null`     | A function to custom tooltip value. Should return a string or DOM. |
| min            | `PropTypes.number`                      | `0`        | Slider min value.                        |
| max            | `PropTypes.number`                      | `100`      | Slider max value.                        |
| value          | `PropTypes.number` or `PropTypes.array` | `10`       | When it be a number, Slider will render single range select. Or pass a array to support multi range select. |
| minRange       | `PropTypes.number`                      | `1`        | The minimum range value between two pickers. |
| jump           | `PropTypes.bool`                        | `false`    | When you are dragging the picker, `jump` decide to update the value by using `jumpRange`. Besides, section points will rendered by `sectionRange`. |
| jumpRange        | `PropTypes.number`                      | `1`        | The minimum value to change, should work with `jump` props. |
| sectionRange        | `PropTypes.number` or `PropTypes.array`                      | `null`        | The section range to render the section point. |
| clickable      | `PropTypes.bool`                        | `false`    | Whether the row can be clicked or not.   |
| updateWhenDrag | `PropTypes.bool`                        | `false`    | In default config, you will receive `onChange` callback after drag finished. But by setting `updateWhenDrag` to `true`, you can get callback as soon as `value` changed when dragging. |
| onChange       | `PropTypes.func`                        | `() => {}` | The callback when value changed.         |

### Custom style

| name         | type               | default | description                              |
| ------------ | ------------------ | ------- | ---------------------------------------- |
| className    | `PropTypes.string` | `''`    | Custom className to change UI.           |
| draggerClass | `PropTypes.string` | `''`    | Custom dragger style                     |
| tipsoClass | `PropTypes.string` | `''`    | Custom tip style                     |
| pathwayClass | `PropTypes.string` | `''`    | Custom pathway style                     |
| color        | `PropTypes.string` | `green` | Theme color. Support `green`, `dark`, `blue`, `red`, `gray` |
| useTipso     | `PropTypes.bool`   | `true`  | Whether use tip or not when hover picker. |

## Dev

```bash
$ git clone git@github.com:ecmadao/rc-range-slider.git
$ cd rc-range-slider
$ npm i
$ npm run storybook
```

## License

Released under MIT License
