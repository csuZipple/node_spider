import {config} from './config'
import request from 'request'
import cheerio from 'cheerio'
import {jdbc as JDBC} from './mysql'
import fs from 'fs'

const jdbc = new JDBC(config.db);
let count = 0;
console.log('开始储存数据');
jdbc.select('select drugId from druglist').then( result => {
    result.forEach(item => {
        let imageUrl = config.imageUrl(item.drugId.replace('CIDs', ''));
        if(imageUrl.split('NA').length > 1){
            return
        }
        jdbc.update('UPDATE druglist SET origin_img_url = ? WHERE drugId = ?', imageUrl, item.drugId).then(() => {
           console.log(`${formatTime(new Date())} 已处理${++count}条数据  共 ${result.length} 条数据`);
            if(count === result.length){
                console.log('储存成功！');
                jdbc.destroy();
            }
        });
    });
});

function formatTime(date){
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

