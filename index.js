const db =require('./db')
const inquirer =  require('inquirer')

module.exports.add= async (title)=>{
  //读取之前的任务，没有就创建文件
  const list = await db.read()
  // 添加title任务
  list.push({title,done:false})
  //存储任务到文件
  await db.write(list)
}

module.exports.clear = async ()=>{
  await db.write([])
}

function askForCreatingTask(list){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新任务',
    default: '新任务'
  }).then(answer4=> {list.push({title:answer4.title,done:false});db.write(list)})
}

function markAsDone(list,index){
  list[index].done = true
  db.write(list)
}

function markAsUnDone(list,index){
  list[index].done = false
  db.write(list)
}

function titleUpdate(list,index){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新标题',
    default: list[index].title
  }).then(answer3=> {list[index].title = answer3.title;db.write(list)})
}

function remove(list,index){
  list.splice(index,1)
  db.write(list)
}

function askForAction(list,index){
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择你要进行的操作',
      choices: [{name:'退出',value:'quit'},
        {name:'已完成',value:'markAsDone'},
        {name:'未完成',value:'markAsUnDone'},
        {name:'修改标题',value:'titleUpdate'},
        {name:'删除',value:'remove'}]
    })
    .then(answer2=>{
      const actions = {
        markAsDone,
        markAsUnDone,
        titleUpdate,
        remove
      }
      const action =  actions[answer2.action]
      action && action(list,index)
    })
}

function printTask(list){
  list.forEach((task,index)=>{
    console.log(`${task.done ? `[x]` : `[_]`} ${index+1}- ${task.title}`);
  })
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你要操作的任务',
      choices: [...list.map((task,index)=>{
        return {name:`${task.done ? `[x]` : `[_]`} ${index+1}- ${task.title}`,value:index}
      }),{name:'创建任务',value: '-1'},{name:'退出',value: '-2'}]
    })
    .then(answer=>{
      const index = parseInt(answer.index)
      if(index >= 0 ){
        askForAction(list,index)
      }else if(index === -1) {
        askForCreatingTask(list)
      }
    })
}

module.exports.showAll = async ()=>{
  const list  = await db.read()
  printTask(list)
}