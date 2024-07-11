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

module.exports = {
    lose3coins,
    lose5coins,
    negativecoins,
    lostitem,
    drink
}

// {"title":"has to chug an alcoholic drink", "function": "drink"},
//     
//     {"title":"swapped places with another player", "function": "swapplayers"},
//     {"title":"sent everyone back to the start", "function": "start"},
//      {"title":"swap 2 spaces", "function": "swapspaces"}