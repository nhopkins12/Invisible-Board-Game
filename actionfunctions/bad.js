const fs = require('fs')
const io = require('../server');

function lose3coins(index) {
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    if (players[index].coins >= 3){
        players[index].coins -= 3;
    }
    else if (players[index].coins < 0){}
    else{
        players[index].coins = 0;
    }
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function lose5coins(index) {
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    if (players[index].coins >= 5){
        players[index].coins -= 5;
    }
    else if (players[index].coins < 0){}
    else{
        players[index].coins = 0;
    }
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function negativecoins(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    players[index].coins = -players[index].coins;
    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function lostitem(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    if (players[index].items.length != 0){
        players[index].items.splice(Math.floor(Math.random()*players[index].items.length), 1);
    }
    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function drink(index){
    // players = JSON.parse(fs.readFileSync('./data/players.json'))
    // io.io.emit('print', players[index].name+' has to ') 
    
    // fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
    //     if (error) {
    //         console.error(error);
    //         throw error;
    // }});
}

function swapplayer(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    
    rand = Math.floor(Math.random()*players.length-1)
    if (rand >= index){ rand++ }
    hold = players[index].location
    players[index].location = players[rand].location
    players[rand].location = hold

    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function start(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    players.forEach(ele => {
        ele.location = board.filter((obj) => obj.type === 'Start')[0].id
    });
    

    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function swapspaces(index){
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    rand1 = Math.floor(Math.random()*board.length)
    rand2 = Math.floor(Math.random()*board.length-1)
    if (rand2 >= rand1){ rand2++ } 

    hold = board[rand1]
    board[rand1] = board[rand2]
    board[rand2] = hold

    board[rand2].id = board[rand1].id
    board[rand1].id = hold.id


    fs.writeFileSync('./data/board.json', JSON.stringify(board), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function teleport(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    
    rand = Math.floor(Math.random()*players.length-1)
    if (rand >= index){ rand++ }
    players[index].location = players[rand].location

    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function balance(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    purse = 0
    players.forEach(ele => {
        purse += ele.coins
    });

    remain = purse % players.length
    purse -= remains

    players.forEach(ele => {
        ele.coins = purse / players.length
    });
    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function skip(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))

    players[index].skip = true
    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function clearitem(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    if (players[index].items.length != 0){
        players[index].items = []
    }
    
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function photo(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    io.io.emit('photo', (players[index]))
}

function rotate(index){
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    options = ['90', '180', '270']
    io.io.emit('rotate', (players[index]), options[Math.floor(Math.random()*options.length)])
}

function file(index){
    
}

module.exports = {
    lose3coins,
    lose5coins,
    negativecoins,
    lostitem,
    drink,
    swapplayer,
    start,
    swapspaces,
    teleport,
    balance,
    skip,
    clearitem,
    photo,
    rotate,
    file
}

// {"title":"has to chug an alcoholic drink", "function": "drink"},
//     
//     {"title":"swapped places with another player", "function": "swapplayers"},
//     {"title":"sent everyone back to the start", "function": "start"},
//      {"title":"swap 2 spaces", "function": "swapspaces"}