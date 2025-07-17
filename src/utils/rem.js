// 用途：echarts字体适配
/**
 * echarts字体自适应
 * @param {*} font 字号大小
 */
export const echartGetFontSize = (font)=> {
    let docEl = document.documentElement,
        clientWidth =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = clientWidth / 1920;
    return font * fontSize;
}

// rem等比适配配置文件
// 基准大小
// const baseSize = 192
// // 设置 rem 函数
// export const setRem =  (width = 150)=> {
//     // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
//     const scale = (document.documentElement.clientWidth - width) / 1920
//     // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
//     document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
// }
// // 初始化
// setRem(150)
// 改变窗口大小时重新设置 `rem`
// window.onresize = function () {
//   setRem()
// }
//防抖
// import debounce from 'loadsh/debounce'
// const setDomFontSizeDebounce = debounce(setDomFontSize, 500)
// window.addEventListener('resize',setDomFontSize)
