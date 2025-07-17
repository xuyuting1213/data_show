module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 80, // 适配的尺寸 75为750 375为37.5...
      propList: ["*"], //是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']
      unitPrecision: 3, //保留rem小数点多少位
      selectorBlackList: [".norem"],  //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法。
      replace: true,
      mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
      minPixelValue: 2, //px小于2的不会被转换
      // exclude: ['node_modules']
    }
  }
}
