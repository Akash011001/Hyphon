const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
var users = require('./logic/Cmd.js')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

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

server.listen(80, ()=>{
    console.log('server is running')
})
