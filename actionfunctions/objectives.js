const fs = require('fs')
const objects = require('../objects')
const io = require('../boardmake');
const { dirname } = require('path');

function spend50(player) {
    return (player.spent >= 50)
}
function spend50setup() {
    
}

function goblin(player){
    hold = player.items;
    titles = hold.map((ele) => ele.title);

    return titles.includes("Goblin Key");
}
function goblinsetup(){
    npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    npcs.push({"name":"Goblin", "id":npcs.length,"location":Math.floor(Math.random()*board.length),"icon":"https://cdn.britannica.com/51/132851-050-D6CA13B6/Bernie-Sanders-2007.jpg","function":"goblin"})

    fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function location(player){
    spot = player.path.filter( (element) => 
        element.type === "Special"
    );
    if (spot.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function locationsetup(){
    rand = Math.floor(Math.random()*board.length)
    while (io.spots[rand].connections >= 3){
        rand = Math.floor(Math.random()*board.length)
    }
    dirnum = Math.floor(Math.random()*4)
    directions = [board[io.spots[rand].up-1], board[io.spots[rand].right-1], board[io.spots[rand].down-1], board[io.spots[rand].left-1]]
    while(directions[dirnum] != undefined){
        dirnum = (dirnum + 1) % 4
    }

    radius = 75
    sampleSize = 100

    const getRandomInRange = (min, max) => Math.random() * (max - min) + min;
    const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    // Get the coordinates of the node to connect to
    const cx = io.spots[rand].x;
    const cy =io.spots[rand].y;
    connectedNode = io.spots[rand];

    let bestLocation = null;
    let maxMinDist = -Infinity;

    for (let i = 0; i < sampleSize; i++) {
        const angle = getRandomInRange(0, 2 * Math.PI);
        const r = getRandomInRange(0, radius);
        var x = cx + r * Math.cos(angle);
        var y = cy + r * Math.sin(angle);
        if (x > 550 || x < 50 || y > 550 || y < 50){
            x = cx
            y = cy
        }

        // Find the minimum distance to existing nodes
        let minDist = Infinity;
        for (const node of io.spots) {
            if (node !== connectedNode) {
                const dist = distance(x, y, node.x, node.y);
                if (dist < minDist) minDist = dist;
            }
        }

        // Update the best location if this one is better
        if (minDist > maxMinDist) {
        maxMinDist = minDist;
        bestLocation = { x, y };
        }
    }

    // Add the new node with a connection to the connectedNode
    // const newNode = { x: bestLocation.x, y: bestLocation.y, connections: [connectedNode] };
    id = io.spots.length+1
    const newNode = new objects.Special(id, bestLocation.x, bestLocation.y);
    io.spots.push(newNode)
    switch (dirnum) {
        case 0: //up
            io.spots[rand].up = newNode.id
            newNode.down = io.spots[rand].id
            break;

        case 1: //right
            io.spots[rand].right = newNode.id
            newNode.left = io.spots[rand].id
            break;

        case 2: //down
            io.spots[rand].down = newNode.id
            newNode.up = io.spots[rand].id
            break;

        case 3: //left
            io.spots[rand].left = newNode.id
            newNode.right = io.spots[rand].id
            break;
    
        default:
            break;
    }

    fs.writeFileSync('./data/board.json', JSON.stringify(io.spots), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }});
}

function marioparty(player){
    hold = player.items;
    titles = hold.map((ele) => ele.title);

    return titles.includes("Star");
}
function mariopartysetup(){
    npcs = JSON.parse(fs.readFileSync('./data/npc.json'))
    board = JSON.parse(fs.readFileSync('./data/board.json'))

    npcs.push({"name":"Toad", "id":npcs.length,"location":Math.floor(Math.random()*board.length),"icon":"https://upload.wikimedia.org/wikipedia/en/d/d1/Toad_3D_Land.png","function":"toad"})

    fs.writeFileSync('./data/npc.json', JSON.stringify(npcs), (error) => {
        if (error) {
            console.error(error);
            throw error;
    }});
}

function buyitem(player){
    hold = player.items;
    tips = hold.map((ele) => ele.title);
    console.log(tips)
    return tips.includes("Magic Vase");
}
function buyitemsetup(){
    shops = io.spots.filter( (element) => 
        element.type === "Shop"
    );
    shop = shops[Math.floor(Math.random()*shops.length)]
    shop.products.push({"title": "Magic Vase", "description": "reset the entire game", "price": 0, "increase": 0, "count": 0, "function": "buyitem"})

    fs.writeFileSync('./data/board.json', JSON.stringify(io.spots), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }});
}

function holdcoins(player){
    return (player.coins >= 20)
}
function holdcoinssetup(){

}

function goodspaces(player){
    spot = player.path.filter( (element) => 
        element.type == "Good"
    );
    if (spot.length >= 10) {
        return true;
    }
    else {
        return false;
    }
}
function goodspacessetup(){
    
}


module.exports = {
    spend50,
    spend50setup,
    goblin,
    goblinsetup,
    location,
    locationsetup,
    marioparty,
    mariopartysetup,
    buyitem,
    buyitemsetup,
    holdcoins,
    holdcoinssetup,
    goodspaces,
    goodspacessetup
}