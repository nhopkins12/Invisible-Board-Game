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
    }
}

class Good extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Good"
    }
}

class Bad extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Bad"
    }
}

class Shop extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Shop"
    }
}

class Teleport extends Spot{
    constructor(id, x, y){
        super(id, x, y);
        this.type = "Teleport"
    }
}

class Player {
    constructor(name){
        this.name = name;
        this.location = NaN;
        this.icon = ""
        this.coins = 0
        this.items = []
    }
}

gridSize = 5
spacing = 50
totalSpots = 17

const board = [];
for (let i = 0; i < totalSpots; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const x = col * spacing + 20; // Calculate x position
    const y = row * spacing + 20; // Calculate y position
    board.push(new Spot(i + 1, x, y));
}

board.forEach(spot => {
    switch (Math.round(Math.random()*4)) {
        case 1:
            board[spot.id-1] = new Bad(spot.id, spot.x, spot.y);
            break;

        case 2:
            board[spot.id-1] = new Shop(spot.id, spot.x, spot.y);
            break;
    
        case 3:
            board[spot.id-1] = new Teleport(spot.id, spot.x, spot.y);
            break;

        default:
            board[spot.id-1] = new Good(spot.id, spot.x, spot.y);
            break;
    } 
});

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
            if (spot.right == undefined && board[ran].left == undefined){
                spot.right = board[ran]
                board[ran].left = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.down == undefined && board[ran].up == undefined){
                spot.down = board[ran]
                board[ran].up = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x <= spot.x && board[ran].y <= spot.y){ // Top Left
        if(spot.x - board[ran].x > spot.y - board[ran].y){
            if(spot.left == undefined && board[ran].right == undefined){
                spot.left = board[ran]
                board[ran].right = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.up == undefined && board[ran].down == undefined){
                spot.up = board[ran]
                board[ran].down = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x >= spot.x && board[ran].y <= spot.y){ // Top Right
        if(board[ran].x - spot.x > spot.y - board[ran].y){
            if(spot.right == undefined && board[ran].left == undefined){
                spot.right = board[ran]
                board[ran].left = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else {
            if(spot.up == undefined && board[ran].down == undefined){
                spot.up = board[ran]
                board[ran].down = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }
    else if(board[ran].x <= spot.x && board[ran].y >= spot.y){ // Bottom Left
        if(spot.x - board[ran].x > board[ran].y - spot.y){
            if(spot.left == undefined && board[ran].right == undefined){
                spot.left = board[ran]
                board[ran].right = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
        else{
            if(spot.down == undefined && board[ran].up == undefined){
                spot.down = board[ran]
                board[ran].up = spot
                spot.connections++;
                board[ran].connections++;
            }
        }
    }

    if(board.every(connectionNum)){
        return
    }
    else{
        return(makePath(board[ran]))
    }
}

center(board)

// Apply Fruchterman-Reingold algorithm
fruchtermanReingoldLayout(board, 550, 550);

adjustRelativeDirections(board);
// center(board)


function fruchtermanReingoldLayout(spots, width, height, iterations = 10000, area = 90000) {
    const k = Math.sqrt(area / spots.length);
    let t = width / 10.0;

    function cool(temp, factor) {
        return temp * factor;
    }

    for (let iter = 0; iter < iterations; iter++) {
        // Calculate repulsive forces
        spots.forEach(v => {
            v.dispX = 0;
            v.dispY = 0;
            spots.forEach(u => {
                if (u !== v) {
                    let deltaX = v.x - u.x;
                    let deltaY = v.y - u.y;
                    let distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                    if (distance < 0.01) distance = 0.01;
                    let repulsiveForce = k ** 2 / distance;
                    v.dispX += (deltaX / distance) * repulsiveForce;
                    v.dispY += (deltaY / distance) * repulsiveForce;
                }
            });
        });

        // Calculate attractive forces
        spots.forEach(v => {
            directions = [v.up, v.right, v.down, v.left]
            directions.forEach(u => {
                if(u != undefined){
                    let deltaX = v.x - u.x;
                    let deltaY = v.y - u.y;
                    let distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                    if (distance < 0.01) distance = 0.01;
                    let attractiveForce = (distance ** 2) / k;
                    v.dispX -= (deltaX / distance) * attractiveForce;
                    v.dispY -= (deltaY / distance) * attractiveForce;
                }
            });
        });

        // Limit max displacement to temperature t and prevent from displacement outside frame
        spots.forEach(v => {
            let dispLength = Math.sqrt(v.dispX ** 2 + v.dispY ** 2);
            if (dispLength < 0.01) dispLength = 0.01;
            v.x += (v.dispX / dispLength) * Math.min(dispLength, t);
            v.y += (v.dispY / dispLength) * Math.min(dispLength, t);

            // Enhanced boundary handling with stronger repulsive force near edges
            const padding = 45; // Increased padding to prevent clustering at edges
            if (v.x < padding) v.dispX += padding - v.x;
            if (v.x > width - padding) v.dispX -= v.x - (width - padding);
            if (v.y < padding) v.dispY += padding - v.y;
            if (v.y > height - padding) v.dispY -= v.y - (height - padding);

            v.x = Math.min(width - padding, Math.max(padding, v.x));
            v.y = Math.min(height - padding, Math.max(padding, v.y));
        });

        t = cool(t, 0.95);
    }
}

function center(nodes){
    avgX = 0
    avgY = 0
    nodes.forEach(node => {
        avgX += node.x
        avgY += node.y
    });
    avgX = avgX / nodes.length
    avgY = avgY / nodes.length

    nodes.forEach(node => {
        node.x += 300 - avgX
        node.y += 300 - avgY
    });
}

function adjustRelativeDirections(spots) {
    spots.forEach(spot => {
        directions = [spot.up, spot.right, spot.down, spot.left]
        directions.forEach(conn => {
            if(conn != undefined){
                const deltaX = spot.x - conn.x;
                const deltaY = spot.y - conn.y;
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                if (distance > 0) {
                    conn.x = spot.x - deltaX;
                    conn.y = spot.y - deltaY;
                }
            }
        });
    });
}

function connectionNum(v) {
    return v.connections >= 2;
}

