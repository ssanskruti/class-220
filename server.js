const express=require("express")
const app=express()
const server=require("http").Server(app)
app.set("view engine","ejs")
app.use(express.static("public"))
const {v4:uuidv4}=require("uuid")

const io=require("socket.io")(server,{cors:{origin:"*"}})

const {ExpressPeerServer}=require("peer")
const peerServer=ExpressPeerServer(server,{debug:true})

app.use("/peerjs",peerServer)

app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room",(req,res)=>{
    res.render("index",{roomId:req.params.room})
})

io.on("connection",(socket)=>{
    socket.on("join-room",(room_id,id,userName)=>{
        socket.join(room_id)
        io.to(room_id).emit("user-connected",id)
        socket.on("message",(message)=>{
            io.to(room_id).emit("createMessage",message,userName)
        })
    })
})

server.listen(3030)