// 解决window.onloade 覆盖问题
function addLoadEvent(func){
    var oldonload = window.onload
    if(typeof window.onload != "function"){
        window.onload = func
    }else{
        window.onload = function() {
            oldonload()
            func()
        }
    }
}
function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement)
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling)
    }
}

// function getNextElement(node) {
//     node = node.nextSibling
//     if(node.nodeType != 1){
//         console.log("a")
//         return getNextElement(node) //函数需要返回
//     }else if(node.nodeType == 1){
//         // console.log(node) //DOM对象
//         return node
//     }else {
//         return false
//     }
// }
function getNextElement(node) {
    node = node.nextSibling
    if(node.nodeType != 1){
        getNextElement(node)
    }
}

function addClass(element,value){
    if(!element.className){
        element.className = value
    }else{
        newClassName = element.className
        newClassName += " "
        newClassName += value
        element.className = newClassName
    }
}
//移动元素
function moveElement(elementId,final_x,final_y,interval){
    if(!document.getElementById("preview")) return false
    var elem = document.getElementById(elementId)
    // console.log(elem)
    if(elem.movement){
        clearTimeout(elem.movement)
    }
    if(!elem.style.left){
        elem.style.left = "0px"
    }
    if(!elem.style.top){
        elem.style.top = "0px"
    }
    var xpos = parseInt(elem.style.left)
    var ypos = parseInt(elem.style.top)
    if(xpos == final_x && ypos == final_y){
        return true
    }
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos)/10);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x)/10);
        xpos = xpos - dist;
    }
    if (ypos < final_y) {
        var dist = Math.ceil((final_y - ypos)/10);
        ypos = ypos + dist;
    }
    if (ypos > final_y) {
        var dist = Math.ceil((ypos - final_y)/10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    var repeat = "moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
    elem.movement = setTimeout(repeat,interval);
}
// 去除空格