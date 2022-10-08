const  homedir = require('os').homedir();
const  home = process.env.HOME || homedir;
const p = require('path')
const dbPath = p.join(home,'.todo')
const fs =  require('fs')

const db = {
  //读取之前的任务没有就创建文件
  read(path = dbPath){
    return new Promise((resolve, reject)=> {
        fs.readFile(path, {flag: 'a+'}, (error, data) => {
          if (error) return reject(error)
            let list;
            try {
              list = JSON.parse(data.toString());
            } catch (error2) {
              list = [];
            }
            resolve(list)
        });
      }
    )
  },
  // 存储任务到文件
  write(list,path = dbPath){
    return new Promise((resolve, reject)=>{
      const string = JSON.stringify(list)
      fs.writeFile(path,string+'\n',(error)=>{if(error){reject(error);}else{resolve()}})
    })
  }
}

module.exports = db