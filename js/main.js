var input_data = getInput()
var newMap = installMine() //有雷的格子对象//mine_url 对应id
var die_num = 0 
var one = 0  //geInput 判断用
// console.log(newMap)
// 获取输入框的数据
function getInput(){
    var col = document.getElementById("col").value == "" ? 10 : document.getElementById("col").value
    var rol = document.getElementById("rol").value == "" ? 10 : document.getElementById("rol").value
    var mine = document.getElementById("mine").value == "" ? 8 : document.getElementById("mine").value
    console.log(typeof(Number(col+rol+mine)))

    if((col*rol) < mine || (col < 2 && rol < 2) || rol > 20 || isNaN(Number(col+rol+mine))){
        col = 10
        rol = 10
        mine = 10
        if(one == 0){
            alert("无效数字,恢复默认")
            one = 1
        }
    }
    return {
        col: col,
        rol: rol,
        mine: mine
    }
}
function button(){
    document.getElementById("end").onclick = function(){
        if(newMap.map[0].surplus == newMap.mine_url.length){
            if(die_num != 0){
                alert("你损失了 " + die_num + " 个队友,真是个小天才!!")
            }else{
                alert("神一样的队友")
            }
        }else{
            alert("谎报军情！")
        }
    }
    document.getElementById("state").onclick = function(){
        one = 0
        input_data = getInput()
        newMap = installMine()
        die_num = 0
        // console.log(document.getElementById("map").childNodes)
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("map"))
        var map = document.createElement("div")
        map.setAttribute("id","map")
        document.getElementsByTagName("body")[0].insertBefore(map,document.getElementById("mine_num"))
        includeDom()

    }
}
//计算
function produce_data(){
    var num = 0
    var map_cells = []
    var get_input = getInput()
    for(var i = 0;i < get_input.col;i++){
        for(var j = 0;j < get_input.rol;j++){
            num = (i)*get_input.rol+(j+1)
            var neighbor = [
                (i-1)*get_input.rol+(j),
                (i-1)*get_input.rol+(j+1),
                (i-1)*get_input.rol+(j+2),
                (i)*get_input.rol+(j),
                (i)*get_input.rol+(j+2),
                (i+1)*get_input.rol+(j),
                (i+1)*get_input.rol+(j+1),
                (i+1)*get_input.rol+(j+2)]
            if(i == 0){
                neighbor[0] = 0
                neighbor[1] = 0
                neighbor[2] = 0
            }
            if(i == get_input.col-1){
                neighbor[5] = 0
                neighbor[6] = 0
                neighbor[7] = 0
            }
            if(j == 0){
                neighbor[0] = 0
                neighbor[3] = 0
                neighbor[5] = 0
            }
            if(j == get_input.rol-1){
                neighbor[2] = 0
                neighbor[4] = 0
                neighbor[7] = 0
            }
            map_cells[num-1] = {
                id: num,
                neighbor: neighbor,
                is_mine: false,
                surplus: get_input.col*get_input.rol,
                is_outof: false
            }
        }
    }
    return map_cells
}
//生成dom元素
function includeDom(){
    var root = document.getElementById("map")
    var data_ceils = produce_data() // 格子对象
    var data_map = getInput()
    for(var i = 0;i <data_ceils.length;i++){
        var ceil = document.createElement("div")
        ceil.setAttribute("class","ceils")
        ceil.setAttribute("id",data_ceils[i].id)
        ceil.setAttribute("style","width:"+ 300/data_map.rol +"px;height:"+ 300/data_map.rol +"px;font-size:" + 300/data_map.rol/2 + "px;line-hight:" + 300/data_map.rol + "px;")
        ceil.setAttribute("style","width:"+ 300/data_map.rol +"px;height:"+ 300/data_map.rol +"px;font-size:" + parseInt(ceil.style.width)/2 + "px;line-hight:" + parseInt(ceil.style.width) + "px;")
        ceil.setAttribute("style","width:"+ 300/data_map.rol +"px;height:"+ 300/data_map.rol +"px;font: " + parseInt(ceil.style.width)/2 + "px/" + parseInt(ceil.style.width) + "px arial;")
        root.appendChild(ceil)
        ceil.onclick = myClick
    }
    document.getElementById("mine_num_span").textContent = input_data.mine
}
// 生成随机数
function createRandom(){
    var data_map = getInput()
    return Math.floor(Math.random()*data_map.rol*data_map.col)+1 //0->x-1
}
//去重
function noRepetition(arr){
    // console.log(arr.length)
    // 不判断arr最后一项
    if(arr.length == 1){
        return arr
    }
    for(var i = 0;i<arr.length-1;i++){
        if(arr[i] == arr[arr.length-1]){
            arr[arr.length-1] = createRandom()
            noRepetition(arr)
        }
    }
    return arr
}
//创建地雷
function createMine(){
    var data_map = getInput()
    var mine = []
    for(var i = 0;i < data_map.mine;i++){
        mine[i] = createRandom()
        mine = noRepetition(mine)
    }
    return mine
}
//安装地雷
function installMine(){
    var mine_url = createMine()
    var map = produce_data()
    for(var i = 0 ;i < map.length;i++){
        for(var j = 0;j < mine_url.length;j++){
            if(mine_url[j] == map[i].id){
                map[i].is_mine = true
            }
        }
    }
    return {
        mine_url:mine_url,
        map:map
    }
}
// 点击事件
function myClick(){
    var click_id = this.id //被点击的id
    var is_mine = newMap.map[click_id-1].is_mine //是否是雷
    // 中雷处理
    
    if(is_mine){
        die_num++
        alert( die_num + " 号队友暴毙!!!")
        if(this.getAttribute("class").indexOf("die") == -1){
            this.setAttribute("class",this.getAttribute("class") + " die")
        }
        return true
    }
    var this_neighbor = newMap.map[click_id-1].neighbor //id与数组对应关系
    var mine_num = 0 //neighbor 周围雷的数量
    newMap.map[click_id-1].is_outof = true
    //统计数量
    for(var i = 0;i < this_neighbor.length;i++){
        if(this_neighbor[i] == 0) continue
        var neighbor_is_mine = newMap.map[this_neighbor[i]-1].is_mine
        if(neighbor_is_mine) mine_num++
    }
    //数量处理
    if(mine_num == 0){
        
        if(this.getAttribute("class").indexOf("show") == -1){
            newMap.map[0].surplus--
            this.setAttribute("class",this.getAttribute("class") + " show")
        }
        
        ifMineNumIsZero(this_neighbor)//元素周围没有雷
    }else{
        // console.log(this.textContent)
        if(this.textContent == "") this.appendChild(document.createTextNode(mine_num))
        if(this.getAttribute("class").indexOf("show") == -1){
            newMap.map[0].surplus--
            this.setAttribute("class",this.getAttribute("class") + " show")
        }
    }
}
function ifMineNumIsZero(neighbor){
    for(var i = 0;i < neighbor.length;i++){
        if(neighbor[i] == 0) continue
        var neighbor_id = neighbor[i] //neighbor 周围元素的id
        var neighbor_ele = newMap.map[neighbor_id-1] //周围元素
        if(newMap.map[neighbor_id-1].is_outof == true) continue
        var dom_neighbor_ele = document.getElementById(neighbor_id) //周围元素dom
        var neighbor_ele_neighbor_num = 0
        // 计算雷数
        for(var j = 0;j < neighbor_ele.neighbor.length;j++){
            if(neighbor_ele.neighbor[j] == 0) continue
            if(newMap.map[neighbor_ele.neighbor[j]-1].is_mine){
                neighbor_ele_neighbor_num++
            }
        }
        // console.log(neighbor_ele_neighbor_num)
        if(neighbor_ele_neighbor_num != 0){
            if(dom_neighbor_ele.getAttribute("class").indexOf("show") == -1){
                newMap.map[0].surplus--
                dom_neighbor_ele.setAttribute("class",dom_neighbor_ele.getAttribute("class") + " show")
            }
            if(dom_neighbor_ele.textContent == ""){
                dom_neighbor_ele.appendChild(document.createTextNode(neighbor_ele_neighbor_num))
            }
            continue
        }else{
            // console.log(newMap.map[neighbor_id-1].neighbor)
            if(dom_neighbor_ele.getAttribute("class").indexOf("show") == -1){
                newMap.map[0].surplus--
                dom_neighbor_ele.setAttribute("class",dom_neighbor_ele.getAttribute("class") + " show")
            }
            newMap.map[neighbor[i]-1].is_outof = true
            ifMineNumIsZero(newMap.map[neighbor_id-1].neighbor)
        }
    }
}
addLoadEvent(includeDom())
addLoadEvent(button())