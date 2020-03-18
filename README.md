# pre-onenote
format and preprocess texts to beautify OneNote

in developing...so slow

格式化待粘贴到OneNote的文本

正在开发中...

## 动机

个人写过自认为不丑的OneNote笔记，习惯在笔记中套用自己的一套格式，但是OneNote for Windows10 中还是暂时不支持自定义格式化，故打算写个网页预处理文本样式，再复制到OneNote中

## 开发日志

20-03-18
- HTML中 span 直接打出换行符可以实现office shift+enter伪换行效果，故shift+enter快捷键应该插入一个换行符伪换行
- 直接复制伪换行会带一个br标签，应该实现复制后自动删除br

20-03-17
- 在仅存在一种样式的情况下，pre标签可以获取正确的text-align等样式,会使用其代替p标签
- 另外slate.js劫持了剪贴板使其不能直接操作富文本，需要在粘贴前将slate屏蔽

20-03-13
- 这几天在学webpack并把项目换成基于原生的electron和webpack了

20-03-03:

- nbsp的字符码是\u00A0即160，测试认为表格从网页粘贴到ON里，需要border-style:none;才会隐藏边框，哪怕是solid 0px也会显示边框，合理，因为ON的表格边框厚度无关

20-02-23：

- 项目终止了一段时间，正在重新安排,使用electron-webpack脚手架

19-09-11：

- 删除

19-08-12：

- 发现仅复制一种格式的字符时（我是加background），格式不会被复制，但是在pre、h1-h5标签中可以是例外，h6却不行，原理不明

19-08-09：

- 发现office不支持Alpha通道颜色，带有A通道的颜色不能复制上去

19-08-06：

- 定题
- 发现office字体在CSS中应以pt（磅/点）为单位而不是px
- 理解OneNote的复制粘贴会有优化，具体表现在
  - ①仅具有空白符的表格行列不会被粘贴=>找到了unicode字符【\u200B】占着茅坑鸟不拉屎符，提醒ON这是有用的表格单元格（我个人喜欢用空白带背景单元格做边距装饰）
  - ②如果字体颜色和字体背景色相近，ON会改变文字颜色=>没有解决办法也不需要解决
