//递归构造树的信息
export const buildTree = (arr, pid = 0, level = 0) =>
{
    let newArr = []; //构造数组列表
    arr.forEach((item,i)=>{
       if((pid == 0 && !item.parentId) || (item.parentId == pid)){
          item.level = level + 1; //得到层级
          var item1 = { id : item.id, label : item.name, level : item.level, children : [] };
          newArr.push(item1);
          if(arr.some(ele => ele.parentId == item.id)){
            item1.children = buildTree(arr, item.id, item.level);
          }
       }     
    });
    
    return newArr;
}