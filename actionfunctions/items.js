const fs = require('fs')
const io = require('../server')

function revealpath(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    player = players[index]
    currentlocation = board[player.location-1];
    directions = [{'dir': 'up', 'id': currentlocation.up}, {'dir': 'right', 'id': currentlocation.right}, {'dir': 'down', 'id': currentlocation.down}, {'dir': 'left', 'id': currentlocation.left}]
    directions = directions.filter((word) => word.id != undefined);
    directionsDisplay = []
    directions.forEach(element => {
        directionsDisplay.push(element.dir+": "+board[element.id-1].type);
    });

    directionsDisplay.forEach( (element) => {
    socket.emit('print', element)
    });
    io.action()
}

async function swap(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who do you want to switch with?', display)
    await socket.emit('playerchoice', copy, 'swap', index)

    socket.on('swap', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
    
        if (selection>=index){
            selection++;
        }
        hold = players[index].location
        players[index].location = players[selection].location
        players[selection].location = hold
    
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function revealobjective(index, socket) { //good
    objectives = JSON.parse(fs.readFileSync('./data/liveobjectives.json'))

    socket.emit('print', '(whisper): The last objective is \"'+ objectives[2].title+'\"')
    io.action()
}

function skip(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who do you want to skip?', display)
    socket.emit('playerchoice', copy, 'skip', index)

    socket.on('skip', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
    
        if (selection>=index){
            selection++;
        }
        players[selection].skip = true
    
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function double(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'));
    players[index].repeat = true;

    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    io.action()
}

function reverse(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    num = players.length
    player = players[index]
    players.splice(index, 1)
    neworder = []
    for (let x = 0; x < num; x++) {
        if (x == index){
            neworder[x] = player
        }
        else {
            neworder[x] = players[players.length-1]
            players.splice(players.length-1, 1)
        }
    }
    fs.writeFileSync('./data/players.json', JSON.stringify(neworder), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    io.action()
}

function trap(index, socket) { //good
    npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    npcs.push({"name":"Trap", "id":npcs.length,"location":players[index].location,"icon":"https://cdn4.vectorstock.com/i/1000x1000/68/88/comic-cartoon-bear-trap-vector-6996888.jpg", "owner": players[index].name, "function":"trap"})
    
    fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    io.action()
}

function stealitem(index, socket) { //good
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who\'s item do you want to steal?', display)
    socket.emit('playerchoice', copy, 'steal', index)

    socket.on('steal', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
    
        if (selection>=index){
            selection++;
        }
        if (players[selection].items.length > 0){
            rand = Math.floor(Math.random()*players[selection].items.length)

            check = []
            players[index].items.forEach(element => {
                check.push(element.title)
            });

            if (check.includes(players[index].items[rand].title)){
                x = check.findIndex((ele) => {ele == players[index].items[rand].title})
                players[index].items[x].count++;
            }
            else{
                players[index].items.push(players[selection].items[rand])
            }


            if (players[selection].items[rand].count == 1){
                players[selection].items.splice(rand-1, 1);
            }
            else{
                players[selection].items[rand].count--;
            }

            io.io.emit('print', players[index].name+' stole a '+players[index].items[rand]+' from '+ players[selection].name)
        }
        else {
            io.io.emit('print', players[selection].name+' does not have any items')
        }
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function stealcoins(index, socket) { 
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who\'s coins do you want to steal?', display)
    socket.emit('playerchoice', copy, 'coins', index)

    socket.on('coins', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
    
        if (selection>=index){
            selection++;
        }
        if (players[selection].coins > 0){
            if (players[selection].coins < 10){
                players[index].coins += players[selection].coins
                io.io.emit('print', players[index].name+' stole '+ players[selection].coins +' coins from '+ players[selection].name)
                players[selection].coins = 0
            }
            else{
                players[index].coins += 10
                io.io.emit('print', players[index].name+' stole 10 coins from '+ players[selection].name)
                players[selection].coins -= 10
            }

            
        }
        else {
            io.io.emit('print', players[selection].name+' does not have any coins')
        }
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function teleport(index, socket) { 
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who do you want to teleport to?', display)
    socket.emit('playerchoice', copy, 'teleport', index)

    socket.on('teleport', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
        
        if (selection>=index){
            selection++;
        }

        players[index].location = players[selection].location

        
        io.io.emit('print', players[index].name+' got teleported to '+players[selection].name)
        
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function drag(index, socket) { 
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    copy = []
    display = []
    players.forEach(element => {
        copy.push(element);
        display.push(element.name);
    });
    copy.splice(index, 1);
    display.splice(index, 1);

    socket.emit('printchoice', 'Who do you want to teleport to?', display)
    socket.emit('playerchoice', copy, 'drag', index)

    socket.on('drag', (selection, index) =>{
        players = JSON.parse(fs.readFileSync('./data/players.json'))
        
        if (selection>=index){
            selection++;
        }

        players[selection].location = players[index].location

        
        io.io.emit('print', players[selection].name+' got teleported to '+players[index].name)
        
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.action()
    });
}

function stay(index, socket) { 
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    io.move([{ dir: players[index]+' stayed in place', id: players[index].location }], 0, socket)
}

module.exports = {
    revealpath,
    swap,
    revealobjective,
    skip,
    double,
    reverse,
    trap,
    stealitem,
    stealcoins,
    teleport,
    drag,
    stay
}