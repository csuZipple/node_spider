import {config} from './config'
import {jdbc as JDBC} from './mysql'

const jdbc = new JDBC(config.db);
let count = 0;
console.log('开始储存数据');
jdbc.select('select cIds from drug_chemical_info').then( result => {
    result.forEach(item => {
        let imageUrl = config.imageUrl(item.cIds.replace('CIDs', ''));
        jdbc.update('UPDATE drug_chemical_info SET originImgUrl = ? WHERE cIds = ?', imageUrl, item.cIds).then(() => {
           console.log(`${formatTime(new Date())} 已处理${++count}条数据   共 ${result.length} 条数据`);
            if(count  === result.length){
                console.log('储存成功！');
                jdbc.destroy();
            }
        });
    });
});

function formatTime(date){
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

