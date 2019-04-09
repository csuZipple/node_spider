import request from 'request'
import fs from 'fs'
import {jdbc as JDBC} from './mysql'
import {config} from "./config";
const path = './images';
const jdbc = new JDBC(config.db);
let count = 0;
let empty =  0;
let error = 0;
if(fs.existsSync(path)){
    let files = fs.readdirSync(path);
    if(files.length){
        console.log('检测到文件残留');
        files.forEach(file => {
            fs.unlinkSync(path + '/' +file)
        });
        console.log('清除成功')
    }
}
jdbc.select('select origin_img_url,drugId from druglist').then( result => {
    result.forEach(item => {
        let url = item['origin_img_url'];
        let name = item['drugId'];
        if(url === ''){
            empty ++;
            return
        }
        const download = request({
            url,
            timeout: 60000
        });
        download.on('error', err => {
            console.error(`ERROR: 下载图片 ${name} 出错  准备重试`, JSON.stringify(err));
            if(err.code === 'ETIMEDOUT'){
                request(url).pipe(fs.createWriteStream(`${path}/${name}.png`).on('close', ()=> {
                    if(count + error +1 === result.length - empty){
                        console.log('下载完成！')
                    }else{
                        console.log(`${formatTime(new Date())} 重新下载 ${name} 成功 已成功下载${count + ++error}`);
                    }
                }));
            }
        });
        download.on('response', resp => {
            if(resp.statusCode === 200){
                download.pipe(fs.createWriteStream(`${path}/${name}.png`).on('close', ()=> {
                    console.log(`${formatTime(new Date())} 已下载${++count}张图片  ${empty ? "【跳过" + empty + "条无效数据】" : ''}  共 ${result.length} 条数据`);
                }))
            }
        })
    })
});
function formatTime(date){
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}
