const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const ques = [
    {
        type: 'input',
        message: '请输入文件名称',
        name: 'file'
    }, {
        type: 'input',
        message: '请输入页面标题名称',
        name: 'title'
    },
    {
        type: "rawlist",
        message: "是否使用vue",
        name: "vue",
        choices: [
            {
                name: "是",
                value: true // 默认选中
            },
            {
                name: "否",
                value: false,
            }
        ]
    }
];
inquirer.prompt(ques).then((answers) => {
    setFileMsg(answers);
});

/**
 * 设置相关文件信息
 * @param fileMsg
 */
function setFileMsg(fileMsg) {
    var dirName = __dirname.substr(0, __dirname.length - 6) + '/page';
    var baseUrl = __dirname.substr(0, __dirname.length - 6) + '/page/' + fileMsg.file + '/' + fileMsg.file;
    var files = {
        html: {
            path: baseUrl + '.html',
            content: '<!DOCTYPE html>\n' +
               '<html>\n' +
               '<head>\n' +
               '    <meta http-equiv="Expires" content="0"/>\n' +
               '    <meta http-equiv="Pragma" content="no-cache"/>\n' +
               '    <meta http-equiv="Cache-control" content="no-cache,no-store"/>\n' +
               '    <meta http-equiv="Cache" content="no-cache"/>\n' +
               '    <meta charset="utf-8"/>\n' +
               '    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>\n' +
               '    <title>' + fileMsg.title + '</title>\n' +
               '    <link rel="stylesheet" href="../../package/layui/css/layui.css"/>\n' +
               (fileMsg.vue ?
               '    <link rel="stylesheet" href="../../package/element/index.css"/>\n' +
               '    <link rel="stylesheet" href="../../assets/css/page/element-ui.css"/>\n' : '') +
               '    <script src="../../package/layui/layui.js"></script>\n' +
               '    <link rel="stylesheet" href="../../assets/css/common.css"/>\n' +
               '    <link rel="stylesheet" href="./' + fileMsg.file + '.css"/>\n' +
               (fileMsg.vue ? '    <script src="../../package/vue/vue.min.js"></script>\n' +
                  '    <script src="../../package/element/index.js"></script>\n' : '') +
               '    <script src="../../config.js"></script>\n' +
               '    <script src="../../assets/js/common.js"></script>\n' +
               '    <script src="../../assets/js/changeTheme.js"></script>\n' +
               '</head>\n' +
               '<body>\n' +
               '<div id="app" v-cloak class="layui-card layui-cardhome">\n' +
               '\n' +
               '</div>\n' +
               '<script src="./' + fileMsg.file + '.js"></script>\n' +
               '</body>\n' +
               '</html>'
        },
        css: {
            path: baseUrl + '.css',
            content: ''
        },
        js: {
            path: baseUrl + '.js',
            content: 'layui.use(["form", "layer", "laydate", "rootManage"], function() {\n' +
               '    var parentWindow = getMainWindow();\n' +
               '    var form = layui.form;\n' +
               '    var layer = layui.layer;\n' +
               '    var rootManage = layui.rootManage;\n' +
               '    var $ = layui.$;\n' +
               (fileMsg.vue ?
               '    var vm = new Vue({\n' +
               '        el: "#app",\n' +
               '        data: function() {\n' +
               '            return {};\n' +
               '        },\n' +
               '        created: function() {\n' +
               '        },\n' +
               '        mounted: function() {\n' +
               '        },\n' +
               '        methods: {}\n' +
               '    });\n' : '') +
               '});'
        }
    };
    createFiles(files, dirName, fileMsg.file);
}

/**
 * 创建文件
 * @param files
 * @param dirName
 * @param fileMsg
 */
function createFiles(files, dirName, fileMsg) {
    // 判断是否存在相同目录
    fs.stat(path.join(dirName, fileMsg), (err) => {
        if (err) {
            fs.mkdir(dirName + '/' + fileMsg, (err => {
                if (err) {
                    return console.log(err);
                }
            }));
            for (let key in files) {
                let val = files[key];
                fs.writeFile(val.path, val.content, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            }
        } else {
            return console.log('存在同名文件！');
        }
    });

}
