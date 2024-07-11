const fs = require('fs')

function get3coins(index) {
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    players[index].coins += 3;
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function get5coins(index) {
    players = JSON.parse(fs.readFileSync('./data/players.json'))
    players[index].coins += 5;
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function getitem(index) {
    players = JSON.parse(fs.readFileSync('./data/players.json'));
    items = JSON.parse(fs.readFileSync('./data/items.json'));
    item = items[Math.floor(Math.random()*items.length)];

    if (players[index].items.filter((obj) => obj.description === item.description).length > 0){
        players[index].items.filter((obj) => obj.description === item.description)[0].count++;
    }
    else {
        players[index].items.push(item);
    }

    players[index].items.push();
    fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

module.exports = {
    get3coins,
    get5coins,
    getitem
}