const fs = require('fs')
const io = require('./server');

const good = require('./actionfunctions/good');
const bad = require('./actionfunctions/bad');

// var playerSockets = 

class Spot {
    constructor(id, x, y){
        this.id = id
        this.x = x
        this.y = y
        this.dispX = 0
        this.dispY = 0

        this.up = undefined
        this.right = undefined
        this.down = undefined
        this.left = undefined
        this.connections = 0
        this.dir = []
    }

    action(player, index, socket){
        io.advance()
    }
}

class Good extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Good"
    }

    action(player, index, socket){
        io.io.emit('print', '');
        io.io.emit('print', player.name+' landed on a good space');
        var challenges = JSON.parse(fs.readFileSync('./data/good.json'))
        var rand = Math.floor(Math.random() * challenges.length);
        
        io.io.emit('print', player.name + ' ' + challenges[rand].title);
        eval("good."+ challenges[rand].function +"(index)");
        io.advance()
    }
}

class Bad extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Bad"
    }
    action(player, index, socket){
        io.io.emit('print', '');
        io.io.emit('print', player.name+' landed on a bad space');
        var challenges = JSON.parse(fs.readFileSync('./data/bad.json'))
        var rand = Math.floor(Math.random() * challenges.length);
        
        io.io.emit('print', player.name + ' ' + challenges[rand].title);
        eval("bad."+ challenges[rand].function +"(index)");
        io.advance()
    }
}

class Shop extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Shop"
        this.products = []
        var items = JSON.parse(fs.readFileSync('./data/items.json'))
        var rand = Math.floor(Math.random() * 2) + 2;
        for (let index = 0; index < rand; index++) {
            var elem = Math.floor(Math.random()*items.length)
            this.products.push(items[elem])
            items.splice(elem, 1);
        }
    }
    action(player, index, socket){
        io.io.emit('print', '');
        io.io.emit('print', player.name+' landed on a shop');

        var products = [];
        var productdisplay = ['Leave'];
        this.products.forEach(element => {
            productdisplay.push(element.title+' - '+element.description+' ($'+element.price+')');
            products.push(element);
        });
        products.unshift('Leave')
        socket.emit('printchoice', 'Pick an item to buy: ', productdisplay);
        socket.emit('shopchoice', products);
    }
}

class Teleport extends Spot{
    constructor(id, x, y, maps){
        super(id, x, y);
        this.type = "Teleport"
        this.maps = maps
    }
    action(player, index, socket){
        var players = JSON.parse(fs.readFileSync('./data/players.json'));
        players[index].location = this.maps;
        fs.writeFileSync('./data/players.json', JSON.stringify(players), (error) => {
            if (error) {
                console.error(error);
                throw error;
        }});
        io.advance()
    }
}

class Start extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Start"
    }
    action(player, index, socket){
        io.io.emit('print', player.name+' is at the start');
        io.advance()
    }
}

class Special extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Special"
    }
    action(player, index, socket){
        io.io.emit('print', player.name+' got to the special space');
        io.advance()
    }
}

class Player {
    constructor(name, url, id, start){
        this.name = name;
        this.location = start;
        this.icon = url;
        this.coins = 0;
        this.spent = 0;
        this.items = [];
        this.id = id;
        this.objectives = [false, false, false]
        this.path = []
        this.repeat = false
        this.skip = false
    }
}

module.exports = {
    Spot,
    Good,
    Bad,
    Shop,
    Teleport,
    Special,
    Start,
    Player
}