## 模板使用说明

#### 命令：

- **三个命令：**

  内置三个命令，开发命令、生产命令、发布命令。

  ```javascript
  npm run dev     // 开发命令
  npm run prod    // 生产命令
  npm run publish // 发布命令
  npm run assets  // 获取全部的本地文件（从媒体服务器上下载）
  ```

- **命令说明：**

  - 开发命令：

    资源会自动复制到`dist`文件夹下，图片不压缩，节省内存空间，只完成代码和资源的监控。

  - 生产命令：

    资源压缩并复制到`dist`文件夹下，图片压缩，`css`和`js`文件处理完成，资源请上传至媒体服务器。

  - 发布命令：

    将`dist`文件夹中的`html`文件复制网址跟目录，并把本地资源删除。
  - 获取资源：
    读取`src/assets.json`文件中的文件列表，并依次下载至本地。

#### 参数说明：

- `mediaDir`：用来记录当前专题图片或者其他资源存放的位置。
- `browserslist`：用来指定`autoprefixer`适配的标准。

#### 更新：

- 2020 / 07 / 28：

  更新内容：

  -  将`ejs`模板文件替换成`html`后缀文件，方便`svn`上传。
  - 模板文件传值新增`version`，用于清除页面缓存。

- 2020 / 08 / 26：

  更新内容：

  -  添加获取资源命令，用于获取媒体服务器上的资源。
  - 优化`gulp`中的图片压缩任务。

  