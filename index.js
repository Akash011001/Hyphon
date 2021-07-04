const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
var users = require('./logic/Cmd.js')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

var port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.sendFile('index.html')
})

io.on('connection', (socket)=>{
    console.log('socket connected')
    socket.on('prcCmd', (string)=>{
        users.prcCmd(string, socket, io)
       
    })
    socket.on('disconnect',()=>{
        users.deleteUser(socket);
        console.log('disconnected')
    })
})

server.listen(port, ()=>{
    console.log('server is running at '+port)
})
