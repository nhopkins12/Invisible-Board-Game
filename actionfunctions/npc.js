const fs = require('fs')
const io = require('../server')

function goblin(index, socket, npcindex) {
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    io.io.emit('print', players[index].name+' ran into a goblin')
    io.io.emit('print', '"HAHAHA you want my key?"')
    io.io.emit('print', '"You\'ll never get it!"')
    io.io.emit('print', players[index].name+' took the goblin\'s key')
    players[index].items.push({"title": "Goblin Key", "description": "", "price": 0, "increase": 0, "count": 1, "function": "goblinkey"})

    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}
function goblinmove(index) {
    npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    currentlocation = board[npcs[index].location-1]

    directions = [{'dir': 'up', 'id': currentlocation.up}, {'dir': 'right', 'id': currentlocation.right}, {'dir': 'down', 'id': currentlocation.down}, {'dir': 'left', 'id': currentlocation.left}]
    directions = directions.filter((word) => word.id != undefined);
    npcs[index].location = directions[Math.floor(Math.random()*directions.length)].id

    fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    io.io.emit('updatePlayer')
}

function trap(index, socket, npcindex){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
    // console.log(players[index].name +' '+ npcs[npcindex].owner)

    if (!(players[index].name === npcs[npcindex].owner)){
        io.io.emit('print', players[index].name+' ran into '+npcs[npcindex].owner+'\'s trap')
        io.io.emit('print', players[index].name+' lost 10 coins')
        if (players[index].coins >= 10){
            players[index].coins -= 10;
        }
        else {
            players[index].coins = 0
        }

        npcs.splice(npcindex, 1)
    }

    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
    fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}
function trapmove(index){

}

function toad(index, socket, npcindex){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    
    io.io.emit('print', '')
    io.io.emit('print', players[index].name+' ran into Toad')
    io.sleep(500)
    hold = players[index].items;
    hold.every((ele) => ele.title);

    if (!hold.includes("Star")){
        io.io.emit('print', '"I\'ll give you a Star for 20 coins?"')
        io.sleep(500)
        if (players[index].coins >= 20){
            players[index].coins -= 20
            players[index].items.push({"title": "Star", "description": "like from mario party", "price": 20, "increase": 0, "count": 1, "function": "star"})
            io.io.emit('print', '"Looks like you got enough!"')
            io.sleep(500)
            io.io.emit('print', players[index].name+' got a Star')
            io.sleep(500)
            io.io.emit('print', '"Well I gotta run!"')
            io.sleep(500)
            io.io.emit('print', 'Toad has moved to a new spot')
            io.sleep(500)

            npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
            board = JSON.parse(fs.readFileSync('./data/board.json'))
            npcs[npcindex].location = Math.floor(Math.random()*board.length)
        }
        else {
            io.io.emit('print', '"Looks like you don\'t have enough coins."')
            io.sleep(500)
            io.io.emit('print', '"Come back later!"')
            io.sleep(500)
        }

        fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
    }
    else {
        io.io.emit('print', '"You already have a Star!"')
        io.sleep(500)
        io.io.emit('print', '"Move it along pal!"')
        io.sleep(500)
    }
}
function toadmove(index){

}

module.exports = {
    goblin,
    goblinmove,
    trap,
    trapmove,
    toad,
    toadmove
}