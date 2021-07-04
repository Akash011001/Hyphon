exports.users = {}

const mat = ['********************','********************','********************','********************'
,'********************','********************','********************','********************']

exports.prcCmd = (string, socket, io)=>{
    var s = string.split("-")
    var s1 ='';
    if(s[1]!=null){
        s1 = s[1].trim()
        console.log(s1)
    }
    switch(s[0]){

        case '#login':
          
           if(s1!=''&&s1!=null){
            var isUserNameExist = false;
            var isUserExist = false;
       
            if(this.users!=null){
                 for(const prop in this.users){
                     if(prop===socket.id){
                         isUserExist = true;
                     }else{
                         isUserExist = false;
                     }
                  if(this.users[prop].userName===s1){
                    isUserNameExist = true;
                    
                 }else{
                    isUserNameExist = false;
                }
            }
        }
        if(!isUserExist){
            if(!isUserNameExist){
                
                this.users[socket.id] = {
                    userName : s1,
                    currentRoom : null
                }
                socket.emit('label', '@'+s1+'>','')
                this.userNotify(socket, ['--login succesfull!--'])
                console.log(this.users[socket.id])
                console.log(this.users[socket.id].userName)
            
            }else{
                this.userNotify(socket, ['--username is already taken--'])
            }
            }else{
            this.userNotify(socket, ['--already login--'])
          }
         }else{
             this.userNotify(socket, ['--user name can not be empty--'])
         }
            break;

        case '#ls':
            if(typeof this.users[socket.id]!=='undefined'){
            if(s1==='rooms'){
                var a = getRooms(io)
                if(a.length>0){
                    
                    var rooms = ''
                    // for(let i=0; i<a.length; i++){
                    //     rooms +=a[i]+" "
                    // }
                    this.userNotify(socket, a)
                    
                }else{
                    this.userNotify(socket, ['--no room available--'])
                }
               
            }else if(s1==='users'){
                if(this.users[socket.id].currentRoom!=null){
                var l = getUsers(this.users[socket.id].currentRoom, this.users)
                if(l!=null){
               this. userNotify(socket, l)
                }else{
            this.userNotify(socket, ['--no users found--'])
                }
        }else{this.userNotify(socket, ['--join room first--'])}
    }
    
    }else{
    this.userNotify(socket, ['--login first--'])
    }
            break;

        case '#create':
            if(typeof this.users[socket.id]!=='undefined'){
               
                if(s1!=null&&s1!=''){
                    var r = getRooms(io)
                    var isRoomExist = false;
                    for(let i=0; i<r.length; i++){
                        if(r[i]===s1){
                            isRoomExist = true
                            break
                        }
                    }
                    if(!isRoomExist){
                    if(this.users[socket.id].currentRoom===null){
            socket.join(s1)
            this.users[socket.id].currentRoom = s1;
            socket.emit('label','@'+this.users[socket.id].userName+'>',s1+'>')
            this.userNotify(socket, ['--new room created--'])
                    }else{
                        this.userNotify(socket, ['--alredy in room--'])
                    }
                }else{this.userNotify(socket, ['--room already exist--'])}

            }else{
                this.userNotify(socket, ['--enter room name--'])
            }
            
        
        }else{
            this.userNotify(socket, ['--login first--'])
        }
        break
        case '#join':
            if(typeof this.users[socket.id]!=='undefined'){
                if(s1!=null&&s1!=''){
                    if(this.users[socket.id].currentRoom===null){
                    var roo = getRooms(io)
                var isRoom = false;
                for(let i = 0; i<roo.length; i++){
                    if(roo[i]===s1){
                        isRoom = true;
                        break;
                    }
                }
                if(isRoom){
                    socket.join(s1)
                    this.users[socket.id].currentRoom = s1
                    this.roomNotify(io,s1,['@'+this.users[socket.id].userName+' has joined'])
                    socket.emit('label', '@'+this.users[socket.id].userName+'>', s1+'>')
                }
            }else{
                this.userNotify(socket, ['--already in room--'])
            }
            }else{
                this.userNotify(socket, ['--enter room name--'])
            }

            }else{
                this.userNotify(socket, ['--login first--'])
            }
            break;

        case '#leave':
            if(typeof this.users[socket.id]!=='undefined'){
                if(this.users[socket.id].currentRoom!=null){
                    socket.leave(this.users[socket.id].currentRoom);
                    this.users[socket.id].currentRoom = null;
                    socket.emit('label','@'+this.users[socket.id].userName+'>','')
                    this.userNotify(socket, ['--you left room--'])
                }else{
                    this.userNotify(socket, ['--you are not in any room--'])
                }
            }else{
                this.userNotify(socket, ['--login first--'])
            }
            break;

        case '#write':
            if(typeof this.users[socket.id]!=='undefined'){
                if(this.users[socket.id].currentRoom!=null){
                    this.roomNotify(io, this.users[socket.id].currentRoom, ['@'+this.users[socket.id].userName+'> '+ s[1]])
                    
                }else{
                    this.userNotify(socket, ['--first join room--'])
                }
            }else{
                this.userNotify(socket, ['--login first--'])
            }
            break
            case '#rename':
                if(typeof this.users[socket.id]!=='undefined'){
                    if(s1!=''&&s1!=null){
                        var isExist = false
                        var a = getAllUsersName(this.users)
                        for(let i=0; i<a.length; i++){
                            if(a[i]===s1){
                                isExist = true;
                                break;
                            }
                        }
                        if(!isExist){
                            this.users[socket.id].userName = s1
                            if(this.users[socket.id].currentRoom!=null){
                            socket.emit('label', '@'+s1+'>',this.users[socket.id].currentRoom+'>')
                            }else{
                                socket.emit('label', '@'+s1+'>', '')
                            }
                        }else{
                            this.userNotify(socket, ['--name alredy taken--'])
                        }
                    }else{
                        this.userNotify(socket,['--name can not be empty--'])
                    }
                }else{
                this.userNotify(socket, ['--login first--'])
            }
             break

             case '#':
                 this.userNotify(socket,mat)
    }
}

exports.broadcast = (socket, room, msg)=>{
    socket.in(room).emit('broadcast', msg)
}

exports.roomNotify = (io, room, msg)=>{
    io.in(room).emit('roomNotify',msg)
}

exports.userNotify = (socket, msg)=>{
    socket.emit('userNotify', msg)
}

function getRooms(io){
    const arr = Array.from(io.sockets.adapter.rooms);
                const filtered = arr.filter(room => !room[1].has(room[0]))
                const res = filtered.map(i =>i[0])
        return res;
}

function getUsers(room, users){
    var list = []
    for(const props in users){
        if(users[props].currentRoom ===room){
            list.push(users[props].userName);
        }
    }
    return list;
}

function getAllUsersName(users){
    var list =[];
    for(const props in users){
       list.push(users[props].userName);
    }
    return list
}

exports.deleteUser = (socket)=>{
    if(this.users.hasOwnProperty(socket.id)){
    delete this.users[socket.id];
    console.log('user deleted')
    }
}