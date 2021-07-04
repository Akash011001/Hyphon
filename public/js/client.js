const socket = io();

var output = document.getElementById('output')
const help = ["/clear : to clear screen", "#login-'your name' : to start",
"/txtcolor-'color name' : to change color of text",
"#ls-rooms : to list available rooms to join",
"#create-'room name' : to create new room",
"#join-'room name' : to join room",
"#ls-users : to list all user in room",
"#leave : to leave current room",
"#write-'message' : to send message in room",
"#rename-'new name' : to change your name"]
               

//on enter 
var input = document.getElementById('input');
var label = document.getElementById('label')
var btn = document.getElementById('enter')

// input.onkeydown = function(event){
//     if(event.key==='Enter'){
//     alert('keydown')
//     }
    
// }
// input.onkeypress = function(event){
//     if(event.key==='Enter'){
//     alert('keypress')
//     }
// }

// input.onkeyup = function(event){
//     if(event.key==='Enter'){
//     alert('keyup')
//     }
// }

input.addEventListener('keydown', (event)=>{
    
    if(event.key==='Enter'){
        event.preventDefault()
        var s = input.textContent.trim();
        if(s[0]==="/"){

            prcLocalCmd(s)
        }else if(s[0]==="#"){
            prcServerCmd(s)
        }

        input.textContent = null;
    }
})

btn.addEventListener('click', (event)=>{
    var s = input.textContent.trim();
        if(s[0]==="/"){

            prcLocalCmd(s)
        }else if(s[0]==="#"){
            prcServerCmd(s)
        }


        input.textContent = null;
})

function createOutput(text){
    if(text!=null){
    for(let i=0; i<text.length; i++){
    var ele = document.createElement('h3');
    ele.textContent = text[i];
    output.appendChild(ele)
    }
}
}

function clearScreen(){
    while(output.firstChild){
        output.removeChild(output.firstChild)
    }
}


function prcLocalCmd(string){
    var s = [];
    s = filter(string).split("-");
    switch(s[0]){

        case '/txtcolor':
            //change txt color
            if(s[1]!=null){
            document.getElementById('terminal').style.color = s[1].trim()
            }
            break;

        case '/clear':
            //clear screen
            clearScreen();
            break;

        case '/help':
           
                createOutput(help)
            break;

        case '/':
           // createOutput(s.toString())
           break;
    }
}

function prcServerCmd(string){
    socket.emit('prcCmd', string.trim())
}

socket.on('broadcast', (msg)=>{

})

socket.on('roomNotify', (msg)=>{
    createOutput(msg)
})

socket.on('userNotify', (msg)=>{
    createOutput(msg);
})

socket.on('label', (user, room)=>{
    changeLabel(user, room)
})

function changeLabel(user, room){
    label.textContent = '>'+user+room;
}

function filter(string){
    var arr = string.split('\n')
    var s = '';
    let i = 0;
    if(arr!=null){
    while(i<arr.length){
        s+=arr[i]
        i++
    }
    }
    return s;
}
