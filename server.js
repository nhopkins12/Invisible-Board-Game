const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs')
const app = express();
const ss = require('socket.io-stream');
app.use(express.json());
app.use(express.static('public'));

var spots = require("./boardmake");
var {Spot, Good, Bad, Shop, Teleport, Start, Player} = require("./objects")
const objectivefunctions = require('./actionfunctions/objectives');
const itemfunctions = require('./actionfunctions/items');
const npcactions = require('./actionfunctions/npc');

const objectives = []
const allobjectives = JSON.parse(fs.readFileSync('./data/objectives.json'))
for (let index = 0; objectives.length < 3; index++) {
    var rand = Math.floor(Math.random()*allobjectives.length);
    objectives.push(allobjectives[rand]);
    allobjectives.splice(rand, 1);
}



var turn = 0
var player = undefined

var gamestart = false;
var directions;
var currentlocation;

fs.writeFileSync('./data/board.json', JSON.stringify(spots.spots), (error) => {
    if (error) {
        console.error(error);
        throw error;
    }});

fs.writeFileSync('./data/players.json', JSON.stringify({}), (error) => {
    if (error) {
        console.error(error);
        throw error;
    }});

fs.writeFileSync('./data/npc.json', JSON.stringify([]), (error) => {
    if (error) {
        console.error(error);
        throw error;
    }});

fs.writeFileSync('./data/liveobjectives.json', JSON.stringify(objectives), (error) => {
    if (error) {
        console.error(error);
        throw error;
    }});

objectives.forEach(obj => {
    eval("objectivefunctions."+ obj.function + "setup()")
});

app.get('/show', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/reset', function(req, res){
    const objectives = []
    const allobjectives = JSON.parse(fs.readFileSync('./data/objectives.json'))
    for (let index = 0; objectives.length < 3; index++) {
        var rand = Math.floor(Math.random()*allobjectives.length);
        objectives.push(allobjectives[rand]);
        allobjectives.splice(rand, 1);
    }
    objectives.forEach(obj => {
        eval("objectivefunctions."+ obj.function + "setup()")
    });
    spots.spots = spots.reset()
    fs.writeFileSync('./data/board.json', JSON.stringify(spots.spots), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});

    fs.writeFileSync('./data/players.json', JSON.stringify({}), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    fs.writeFileSync('./data/npc.json', JSON.stringify([]), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }});
    
    fs.writeFileSync('./data/liveobjectives.json', JSON.stringify(objectives), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }});
    res.redirect('../show')
});

app.get('/display', function (req, res){
    res.json({"board": JSON.parse(fs.readFileSync('./data/board.json')), "players": JSON.parse(fs.readFileSync('./data/players.json')), "npc": JSON.parse(fs.readFileSync('./data/npc.json'))});
});

// app.get('/photo', function(req, res){
//     res.send('hello world')
// });

// app.get('/photo', function(req, res){
//     res.redirect('../photo.jpeg');
// });

app.get('/rotate/reset', function(req, res){
    // io.emit('rotate', 0)
});

const port = 3000;

// '10.0.0.148'
// app.listen(port, function (err) {
//     if (err) console.log(err);
// });

const server = http.createServer(app);

const io = require('socket.io')(server);

io.emit("update");

const connections = [];
const playerconnections = [];

io.sockets.on('connection',(socket) => {
    connections.push(socket);

    console.log(' %s sockets is connected', connections.length);

    socket.on('join', (arg, arg2) =>{
        playerconnections.push(socket);
        read = JSON.stringify(JSON.parse(fs.readFileSync('./data/players.json')))
        if (read != "{}"){
            players = JSON.parse(read)
        }
        else {
            players = []
        }
        console.log(spots.spots.filter((x) => x.type == 'Start'))
        players.push(new Player(arg, arg2, socket.id, spots.spots.filter((x) => x.type == 'Start')[0].id))
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        if (players.length <= 1){
            socket.emit("p1")
        }
        else {
            socket.emit("print", "Waiting for "+ players[0].name +" to start the game.")
        }
        io.emit("update");
    });

    socket.on('rejoin', (arg, arg2) =>{
        playerconnections.push(socket);
        players = JSON.stringify(JSON.parse(fs.readFileSync('./data/players.json')))
        index = players.indexOf((elem) => {
            (elem.name === arg && elem.icon === arg2)
        });
        if(index != -1){
            players[index].id = socket.id
        }
    });

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log(' %s sockets is connected', connections.length);
    });

    socket.on('playerturn', () => {
        io.emit("print", "")
        gamestart = true;
        var displayobjectives = [objectives[0].title, objectives[1].title, '???']
        io.emit("printchoice", "Objectives:", displayobjectives)
        turnstart(socket)
    });

    socket.on('move', (options, choice) => {
        io.emit('print', options[choice].dir);
        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        players[turn % players.length].location = options[choice].id
        players[turn % players.length].path.push(spots.spots[options[choice].id-1])
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.emit("updatePlayers")

        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        player = players[turn % players.length]
        var npcs = JSON.parse(fs.readFileSync('./data/npc.json'));
        
        npcs.forEach((element, i) => {
            if (element.location == player.location){
                eval('npcactions.'+element.function+'(turn % players.length, socket, i)')
            }
        });
        io.emit("updatePlayers")
        spots.spots[players[turn % players.length].location-1].action(players[turn % players.length], turn % players.length, socket)
    });

    socket.on('advance', () => {
        advance()
    });

    socket.on('items', () => {
        io.emit('print', '')
        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        player = players[turn % players.length]
        items = player.items
        userItems = []
        player.items.forEach(element => {
            userItems.push(element.title)
        });
        userItems.unshift('Back')
        items.unshift('Back')
        io.emit('printchoice', 'Pick an item', userItems);
        playersocket.emit('itemchoice', items);
    });

    socket.on('buyitem', (index) => {
        io.emit('print', '')
        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        player = players[turn % players.length]
        item = spots.spots[player.location-1].products[index-1]
        if (player.coins >= item.price){
            if (player.items.filter((obj) => obj.description === item.description).length > 0){
                player.items.filter((obj) => obj.description === item.description)[0].count++;
            }
            else {
                player.items.push(item)
            }
            player.spent += item.price;
            fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
                if (error) {
                    console.error(error);
                    throw error;
            }});
            io.emit('print', player.name+' bought a '+item.title)
        }
        else {
            io.emit('print', player.name+' tried to buy a '+item.title+' but is too broke')
        }
    });

    socket.on('useitem', (index) => {
        io.emit('print', '')
        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        player = players[turn % players.length]
        item = player.items[index-1]
        
        io.emit('print', player.name+' used a '+item.title)
        eval("itemfunctions."+item.function+"(turn % players.length, socket)")

        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        player = players[turn % players.length]
        item = player.items[index-1]
        
        if (item.count == 1){
            player.items.splice(index-1, 1)
        }
        else{
            item.count--;
        }
        
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.emit('updatePlayers')
    });

    socket.on('actions', (option) => {
        action()
    });

    // socket.on('image', (file) => {
    //     console.log(file)
    //     fs.writeFileSync("./tmp/upload.jpeg", file, (err) => {
    //         // callback({ message: err ? "failure" : "success" });
    //     });
    // });

    ss(socket).on('file-upload', (stream, data) => {
        const filePath = path.join(__dirname, 'public', data.fileName);
    
        // Create a write stream to save the file
        const writeStream = fs.createWriteStream(filePath);
    
        // Pipe the incoming stream to the write stream
        stream.pipe(writeStream);
    
        // When the file is fully written, send a success message to the client
        writeStream.on('finish', () => {
            console.log(`File saved: ${data.fileName}`);
            socket.emit('upload-success', `File ${data.fileName} uploaded successfully!`);
        });
    
        // Handle any errors during the write process
        writeStream.on('error', (err) => {
            console.error('Error saving file:', err);
            socket.emit('upload-failure', 'Failed to save file.');
        });
    })
});

function action(){
    io.emit('print', '')
    currentlocation = spots.spots[player.location-1];
    directions = [{'dir': 'up', 'id': currentlocation.up}, {'dir': 'right', 'id': currentlocation.right}, {'dir': 'down', 'id': currentlocation.down}, {'dir': 'left', 'id': currentlocation.left}]
    directions = directions.filter((word) => word.id != undefined);
    directionsDisplay = []
    directions.forEach(element => {
        directionsDisplay.push(element.dir)
    });
    directions.unshift('Items');
    directionsDisplay.unshift('Items');
    
    io.emit('printchoice', 'Pick an action: ', directionsDisplay)
    playersocket.emit('choice', directions);
}

app.get('/update', function (req,res){
    io.emit("update")
    res.sendStatus(200)
});

// , '10.0.0.148''159.89.120.211'
server.listen(port, '159.89.120.211');
console.debug('Server listening on port 159.89.120.211:' + port);

async function move(options, choice, socket){
    io.emit('print', options[choice].dir);
    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    players[turn % players.length].location = options[choice].id
    players[turn % players.length].path.push(spots.spots[options[choice].id-1])
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    io.emit("updatePlayers")

    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    player = players[turn % players.length]
    var npcs = JSON.parse(fs.readFileSync('./data/npc.json'));
    
    npcs.forEach((element, i) => {
        if (element.location == player.location){
            eval('npcactions.'+element.function+'(turn % players.length, socket, i)')
        }
    });

    spots.spots[players[turn % players.length].location-1].action(players[turn % players.length], turn % players.length, socket)
}

function turnstart(socket){
    io.emit('print', '')
    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    player = players[turn % players.length]

    playersocket = playerconnections.filter((word) => word.id == player.id)[0];
    io.emit('print', player.name+"'s Turn");
    io.emit('print', '')
    currentlocation = spots.spots[player.location-1];
    directions = [{'dir': 'up', 'id': currentlocation.up}, {'dir': 'right', 'id': currentlocation.right}, {'dir': 'down', 'id': currentlocation.down}, {'dir': 'left', 'id': currentlocation.left}]
    directions = directions.filter((word) => word.id != undefined);
    directionsDisplay = []
    directions.forEach(element => {
        directionsDisplay.push(element.dir)
    });
    directions.unshift('Items');
    directionsDisplay.unshift('Items');
    
    io.emit('printchoice', 'Pick an action: ', directionsDisplay)
    playersocket.emit('choice', directions);
}

function advance(){
    checkobjectives()
    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    player = players[turn % players.length]
    if (!player.repeat){
        var npcs = JSON.parse(fs.readFileSync('./data/npc.json'));
        if (turn % players.length == players.length-1){
            npcs.forEach((npc, i) => {
                eval('npcactions.'+npc.function+'move(i)')
            });
        }
        turn++;
        if (players[turn % players.length].skip){
            io.emit('print', "");
            io.emit('print', "Skipped "+players[turn % players.length].name+"'s Turn");
            players[(turn) % players.length].skip = false
            if (turn % players.length == players.length-1){
                npcs.forEach((npc, i) => {
                    eval('npcactions.'+npc.function+'move(i)')
                });
            }
            turn++;
        }
    }else{
        player.repeat = false;
    }
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    
    // await sleep(3000)
    
    if(gamestart){
        turnstart(playerconnections[turn % players.length])
    }
}

function checkobjectives(){
    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    players.forEach(function (player, i) {
        players[i].objectives[0] = eval("objectivefunctions."+ objectives[0].function + "(player)");
        players[i].objectives[1] = eval("objectivefunctions."+ objectives[1].function + "(player)");
        players[i].objectives[2] = eval("objectivefunctions."+ objectives[2].function + "(player)");
    });

    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    players.forEach(function (player, i) {
        if(players[i].objectives.every((v) => {v})){
            finish(i)
        }
    });
}

function finish(index){
    var players = JSON.parse(fs.readFileSync('./data/players.json'));
    io.emit('print', players[index]+' won!')
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports.advance = advance;
module.exports.action = action;
module.exports.move = move;
module.exports.sleep = sleep;
module.exports.io = io;