/**
 * jdbc for javascript database connection
 */
import mysql from 'mysql'

export class jdbc   {
    constructor(config){
        this.pool = mysql.createPool(config);
        this.connection = null
    }
    init (f, ...args) {
        if(this.connection){
            f(this.connection , ...args);
        }else{
            this.pool.getConnection((err, connection) => {
                if(err){
                    return console.error('连接数据库失败')
                }
                this.connection = connection;
                f(connection , ...args);
            })
        }
    }
    fn (sql, ...args) {
        return new Promise(((resolve, reject) => {
            this.init(connection => {
                console.log(args)
                connection.query(sql, args, (err, result) => {
                    if(err){
                        reject('sql运行错误 sql-> ', sql ,' Error:  ', JSON.stringify(err))
                    }
                    resolve(result)
                })
            })
        }))
    }
    /**
     * Todo: 参数验证
     * @param sql
     * @param args
     */
    insert(sql, ...args){
        return this.fn(sql, ...args)
    }
    update(sql, ...args){
        return this.fn(sql, ...args)
    }
    del(sql, ...args){
        return this.fn(sql, ...args)
    }
    select(sql, ...args){
        return this.fn(sql, ...args)
    }
    destroy(){
        if(this.connection){
            this.connection.destroy()
        }
    }
}