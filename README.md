# js-chunk-file-upload

## 序言

> js-chunk-file-upload是用于处理大文件切片断点续传的工具，相较于其他断点续传包，在已有的切片，断点续传基础上新增自定义上传请求，使用更为灵活。

## 项目信息

1. 原创作者：Peoren
2. 开源协议：MIT
3. 发布日期：2022-04-2
4. 联系方式：hjw_ready@163.com
5. 开源地址：https://github.com/peoren/chunk-file-upload.git

## 用法

```
$ npm i js-chunk-file-upload
```

```js   
        // 最好是一个文件创建一个实例,初始化时定义大小和模式
        const cuf = new ChunkUploadFile({
            size: 10240
        })
        // 打开文件对话框
        cuf.readFile()
        // 钩子函数： 文件读取完毕
        cuf.onFileReadEnd = function (file, fileId) {
            const formdata = new FormData
            formdata.append('md5', fileId)
            console.log('file', file);
            // first request
            setTimeout(() => {
                // 文件发送接口，
                // customReq为自定义请求，必传参数，当请求完毕后调用next()函数，以便内部获知。
                // savedChunkIds为已经上传的数组，传入已经上传chunkId数组，将会跳过这些数据，避免重复上传。
                cuf.sendFile({
                    customReq: function (file, next) {
                        console.log('单独的切片文件-》', file);
                        file.chunks = file.chunkLength
                        file.chunk = file.chunkId
                        file.chunkSize = cuf.chunkSize
                        // 将单个文件包装成formdata,当然也可以自己处理
                        const data = cuf.packgeChunk(file)
                        file = null
                        // upload request
                        setTimeout(() => {
                            next()
                        }, 1000);
                    }
                })
            }, 1000);


        }
        // 文件转hash进度
        cuf.hashProgress = function (r) {
            console.log('文件转哈希进度==>', r);
        }
        // 钩子函数

        // 单个上传失败
        cuf.onUploadFail = function (err, index) {
            console.log(err, index);
        }
        // 单个文件上传完成
        cuf.onUpload = function (res, index) {
            console.log(res, index);
        }
        // 暂停
        cuf.onPaused = function () {
            console.log('暂停了');
        }
        // 继续
        cuf.onContinue = function () {
            console.log('继续了');
        }
        // 全部上传完成
        cuf.onFullUpload = function (fileId) {
            console.log('全部传送完毕');
        }
        
        // 暂停方法
        cuf.pauseUpload()
        // 继续方法
        cuf.continueUpload()
        // 将单个file包装成formData
        cuf.packgeChunk()
        // 销毁生命周期
        

```


## 示例

demo目录内有简单的示例代码


## 主要功能

**文件上传**：文件切片，上传，断点续传。

**生命周期**：文件转哈希-文件读取-单个文件上传-记录整合数据-上传完成

**操控**：能够打断上传过程

**续传**：在sendFile()方法中定义了接口，可以通过传入已经上传的chunkId来达到续传功能。

**哈希进度**：在文件读取，转哈希时会将文件全部读取，并逐步转md5，所以耗费时间较多，在hashProgress(progress)中可以获取进度

**小于切片大小的文件**：TODO

## 开源协议

MIT

## 生命周期|钩子函数

| 方法名称        | 参数                                                  | 功能           |
| --------------- | ----------------------------------------------------- | -------------- |
| hashProgress      | progress: 进度信息                                    | 文件转哈希读取中     |
| onFileReadEnd   | file, fileId                                          | 文件读取完成   |
| onUpload   | progress:总体上传进度，chunkId               | 文件上传完成   |
| onFullUpload     | fileId                                                   | 全部上传完成       |
| onPaused |    无                                                 | 暂停后       |
| onContinue |    无                                                 | 继续后       |

## 方法

| 方法名称         | 参数                                                 |
| ---------------- | ---------------------------------------------------- |
| readFile      |       无                        | 打开文件对话框读取文件     |
| ChunkUploadFile       | 传入：可选{size:number,mode:string},size:为切片大小，mode为模式：并行:parallel（无法使用暂停继续），串行：serial       |
| sendFile        | {customReq:function,savedChunkIds:Array}, customReq:funtion(file:File, next:function){}自自定义是上传函数，必穿，传入file:单个切片文件，next完成上传后调用。savedChunkIds：可选，chunkId数组      |
| continueUpload         | 续传                                                 |
| pauseUpload             | 暂停                                                 |

## 联系我
hjw_ready@163.com



