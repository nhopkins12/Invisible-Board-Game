// class Car {
//     constructor(name, year) {
//         this.name = name;
//         this.year = year;
//     }
// }
const [good, bad, shop, teleport] = [0,1,2,3];

class Spot {
    constructor(id, x, y){
        this.id = id
        this.x = x
        this.y = y

        this.up = undefined
        this.right = undefined
        this.down = undefined
        this.left = undefined
        this.connections = 0
    }
}

// class Good extends Spot{
//     constructor(id, x, y){
//         super(id, x, y);
//     }
// }

class Player {
    constructor(name){
        this.name = name;
        this.location = NaN;
    }
}

gridSize = 2
spacing = 50
totalSpots = 4

const board = [];
for (let i = 0; i < totalSpots; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const x = col * spacing + 20; // Calculate x position
    const y = row * spacing + 20; // Calculate y position
    board.push(new Spot(i + 1, x, y));
}
makePath(board[0])

function makePath(spot) {
    ran = Math.round(Math.random()*(totalSpots-2));
    if(ran >= spot.id){
        ran++;
    }
    // console.log(ran)
    // console.log(board[ran])
    if(board[ran].x >= spot.x && board[ran].y >= spot.y){ // Bottom Right
        if(board[ran].x - spot.x > board[ran].y - spot.y){
            if (spot.right == undefined && spot.left == undefined){
                spot.right = board[ran]
                board[ran].left = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.down == undefined && spot.up == undefined){
                spot.down = board[ran]
                board[ran].up = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x <= spot.x && board[ran].y <= spot.y){ // Top Left
        if(spot.x - board[ran].x > spot.y - board[ran].y){
            if(spot.left == undefined && spot.right == undefined){
                spot.left = board[ran]
                board[ran].right = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.up == undefined && spot.down == undefined){
                spot.up = board[ran]
                board[ran].down = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x >= spot.x && board[ran].y <= spot.y){ // Top Right
        if(board[ran].x - spot.x > spot.y - board[ran].y){
            if(spot.right == undefined && spot.left == undefined){
                spot.right = board[ran]
                board[ran].left = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.up == undefined && spot.down == undefined){
                spot.up = board[ran]
                board[ran].down = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x <= spot.x && board[ran].y >= spot.y){ // Bottom Left
        if(spot.x - board[ran].x > board[ran].y - spot.y){
            if(spot.left == undefined && spot.right == undefined){
                spot.left = board[ran]
                board[ran].right = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else{
            if(spot.down == undefined && spot.up == undefined){
                spot.down = board[ran]
                board[ran].up = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }

    if(board.every(v => v.connections >= 2)){
        return
    }
    else{
        return(makePath(board[ran]))
    }
}

console.log(board)