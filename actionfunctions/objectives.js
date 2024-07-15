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
    // rand = Math.floor(Math.random()*board.length)
    board = [...io.spots]
    shuffle(board)
    rand = board.reduce((prev, curr) => prev.connections < curr.connections ? prev : curr);
    dirnum = Math.floor(Math.random()*4)
    directions = [board[rand.up-1], board[rand.right-1], board[rand.down-1], board[rand.left-1]]
    while(directions[dirnum] != undefined){
        dirnum = (dirnum + 1) % 4
    }

    radius = 75
    sampleSize = 100

    const getRandomInRange = (min, max) => Math.random() * (max - min) + min;
    const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    // Get the coordinates of the node to connect to
    const cx = rand.x;
    const cy =rand.y;
    connectedNode = rand;

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
            rand.up = newNode.id
            newNode.down = rand.id
            break;

        case 1: //right
            rand.right = newNode.id
            newNode.left = rand.id
            break;

        case 2: //down
            rand.down = newNode.id
            newNode.up = rand.id
            break;

        case 3: //left
            rand.left = newNode.id
            newNode.right = rand.id
            break;
    
        default:
            break;
    }

    fs.writeFileSync('./data/board.json', JSON.stringify(io.spots), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }});

    function shuffle(array) {
        let currentIndex = array.length;
    
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
    
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }
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