//引入 fs http path 模块
const http = require('http');
const fs = require('fs');
const path = require('path');
//引入第三方模块 npm下载的
const mime = require('mime');
//记录网站根目录
let rootPath = path.join(__dirname, 'www');//join方法中的参数1是 __dirname(获取网站根目录) 第二个参数是所要访问的文件夹
//创建node服务器对象
let server = http.createServer((request, response) => {
    //生成地址  拿到用户请求的路径和网站根目录拼接生成完整的请求路径
    let targetPath = path.join(rootPath, request.url);
    // console.log(targetPath);
    //拿到用户请求的路径 判断这个路径在服务器中是否存在 如果存在就返回用户要访问的内容  如果不存在就返回404提示
    if (fs.existsSync(targetPath)) {
        // 文件 还是文件夹
        fs.stat(targetPath, (err, stats) => {

            //判断用户请求的是否是文件 是文件就直接读取并返回
            if (stats.isFile()) {//判断是否是文件
                //获取文件类型 然后设置 content-type  用path.extname(targetPath)方法 参数是用户请求的路径
                // let extName = path.extname(targetPath);//使用这个方法获取用户要请求文件的类型
                // if ( extName == '.html' ){
                //     response.setHeader('content-type','text/html;charset=utf-8');
                // }
                // if ( extName == '.css' ){
                //     response.setHeader('content-type','text/css');
                // }
                // if ( extName == '.png' ){
                //     response.setHeader('content-type','image/png');
                // }
                // if ( extName == '.jpg' ){
                //     response.setHeader('content-type','image/jpg');
                // }
                //使用npm 管理工具 mime 插件来获取
                //在上边引入第三方模块
                //使用mime设置文件类型  用mime.getType(targetPath)  mime的这个方法获取文件类型，参数是用户请求的路劲
                response.setHeader('content-type', mime.getType(targetPath));
                //是文件就直接读取 然后返回
                fs.readFile(targetPath, (ree, data) => {
                    //返回读取到的文件内容
                    response.end(data);
                });
            }

            //判断用户请求的是否是文件夹 是就生成列表渲染在页面上
            if (stats.isDirectory()) {
                //是文件夹就读取文件夹信息
                fs.readdir(targetPath, (err, files) => {
                    let tem = '';
                    //拿到的文件信息是存在数组中的所以遍历数组
                    for (var i = 0; i < files.length; i++) {
                        tem += `<li><a href="${request.url}${request.url =='/'?'':'/'}${files[i]}">${files[i]}</a></li>`
                    }
                    response.end(
                        `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>index of /</title>
                        </head>
                        <body>
                            <h1>index of ${request.url}</h1>
                            <ul>${tem}</ul>
                        </body>
                        </html>
                        `
                    )
                })
            }
        });
    } else {
        //如果不存在 就返回404页面 同事改变响应码 为404
        response.statusCode = 404;//改变响应的状态码为404
        response.setHeader('content-type', 'text/html;charset=utf-8');
        response.end(
            `
                <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                <html><head>
                <title>404 Not Found</title>
                </head><body>
                <h1>Not Found</h1>
                <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
                </body></html>
            `
        )
    }
    // response.end('hello world');
});

// 开启服务器 (监听就是开启服务器)
server.listen(8848, '127.0.0.1', () => {
    console.log('开启成功');
});