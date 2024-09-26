var {Spot, Good, Bad, Shop, Teleport, Start, Player} = require("./objects")
    
    board = reset()

    function reset() {
        const board = [];
        spacing = 50
        totalSpots = Math.floor(Math.random()*8)+13
        gridSize = Math.floor(Math.sqrt(totalSpots))
        averageConst = (Math.floor(Math.random()*5)/10)+2.1

        
        for (let i = 0; i < totalSpots; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = col * spacing + 20; // Calculate x position
            const y = row * spacing + 20; // Calculate y position
            board.push(new Spot(i + 1, x, y));
        }

        do {
            board.forEach(spot => {
                board[spot.id-1] = new Spot(spot.id, spot.x, spot.y)
            });

            board.forEach(spot => {
                if (spot.constructor.name === 'Spot'){
                    ran = Math.floor(Math.random()*5)
                    switch (ran) {
                        case 1:
                            if (board.filter((obj) => obj.type === 'Good').length < board.filter((obj) => obj.type === undefined).length || board.filter((obj) => obj.type === 'Bad').length < board.filter((obj) => obj.type === undefined).length){
                                ran = 0
                            } else {
                                break;
                            }

                        case 2:
                            if (board.filter((obj) => obj.type === 'Shop').length < 3) {
                                board[spot.id-1] = new Shop(spot.id, spot.x, spot.y);
                                break;
                            }

                    
                        case 3:
                            if (board.filter((obj) => obj.type === 'Teleport').length < 1) {
                                connection = undefined
                                limit = 0
                                while((connection==undefined || board[connection].constructor.name === 'Spot') && limit <= 100){
                                    connection = Math.round(Math.random()*(totalSpots-2))
                                    limit++;
                                }
                                if (limit <= 100){
                                    spot2 = board[connection]
                                    board[spot.id-1] = new Teleport(spot.id, spot.x, spot.y, spot2.id);
                                    board[spot2.id-1] = new Teleport(spot2.id, spot2.x, spot2.y, spot.id);
                                    break;
                                }
                            }

                        case 0:
                            if (board.filter((obj) => obj.type === 'Bad').length > board.filter((obj) => obj.type === 'Good').length){    
                                board[spot.id-1] = new Good(spot.id, spot.x, spot.y);
                                break;
                            }
                            else {
                                ran = 4
                            }

                        default:
                            board[spot.id-1] = new Bad(spot.id, spot.x, spot.y);
                            break;
                    }
                } 
            });
        }
        while(
            board.filter((e) => e.type == "Bad").length == 0 ||
            board.filter((e) => e.type == "Good").length == 0 ||
            board.filter((e) => e.type == "Shop").length == 0
            )

        // console.log(totalSpots)

        function makePath(spot, countfull = 0) {
            found = false
            count = 0
            ran = (Math.round(Math.random()*(totalSpots-2)));
            if(ran >= spot.id-1){
                ran++;
            }
            // console.log(board[ran])
            // console.log(totalSpots+": "+ran)
            while(!found){
                if(board[ran].x >= spot.x && board[ran].y >= spot.y){ // Bottom Right
                    if(board[ran].x - spot.x > board[ran].y - spot.y){
                        if (spot.right == undefined && board[ran].left == undefined){
                            spot.right = board[ran].id
                            board[ran].left = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                    else {
                        if(spot.down == undefined && board[ran].up == undefined){
                            spot.down = board[ran].id
                            board[ran].up = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                }
                else if(board[ran].x <= spot.x && board[ran].y <= spot.y){ // Top Left
                    if(spot.x - board[ran].x > spot.y - board[ran].y){
                        if(spot.left == undefined && board[ran].right == undefined){
                            spot.left = board[ran].id
                            board[ran].right = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                    else {
                        if(spot.up == undefined && board[ran].down == undefined){
                            spot.up = board[ran].id
                            board[ran].down = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                }
                else if(board[ran].x >= spot.x && board[ran].y <= spot.y){ // Top Right
                    if(board[ran].x - spot.x > spot.y - board[ran].y){
                        if(spot.right == undefined && board[ran].left == undefined){
                            spot.right = board[ran].id
                            board[ran].left = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                    else {
                        if(spot.up == undefined && board[ran].down == undefined){
                            spot.up = board[ran].id
                            board[ran].down = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                }
                else if(board[ran].x <= spot.x && board[ran].y >= spot.y){ // Bottom Left
                    if(spot.x - board[ran].x > board[ran].y - spot.y){
                        if(spot.left == undefined && board[ran].right == undefined){
                            spot.left = board[ran].id
                            board[ran].right = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                    else{
                        if(spot.down == undefined && board[ran].up == undefined){
                            spot.down = board[ran].id
                            board[ran].up = spot.id
                            spot.connections++;
                            board[ran].connections++;
                            found = true
                        }
                    }
                }
                if (!found){
                    ran = (Math.round(Math.random()*(totalSpots-2)));
                    if(ran >= spot.id-1){
                        ran++;
                    }
                }
                if (count >= 100){
                    break
                }
                count++
                countfull++
            }
            if (board[ran].connections >= 4){
                min = board.reduce((prev, curr) => prev.connections < curr.connections ? prev : curr);
                // console.log(min)
                ran = min.id-1
                // console.log(board.filter((e) => e.connections < 2).length)
            }

            const sum = board.reduce((a, b) => a + b.connections, 0);
            const avg = (sum / board.length) || 0;

            three = board.filter((e) => e.connections >= 3).length
            four = board.filter((e) => e.connections >= 4).length
            // console.log(avg)
            if(avg > averageConst && canVisitAllNodes(board, 0, board.length) && three >= Math.floor(Math.sqrt(board.length))+1 && four >= 1){
                return
            }
            else{
                return(makePath(board[ran], countfull))
            }
        }

        center(board)

        board.forEach(spot => {
            directions = [board[spot.up-1], board[spot.right-1], board[spot.down-1], board[spot.left-1]]
            
            hold = directions.filter((conn) => conn != undefined);
            // console.log(directions)
        });

        // while (!canVisitAllNodes(board, 0, board.length)){
        //     board.forEach(spot => {
        //         spot.up = undefined;
        //         spot.right = undefined;
        //         spot.down = undefined;
        //         spot.left = undefined;
        //     });


        //     makePath(board[Math.floor(Math.random()*board.length)])
        // }
        success = false
        while (!success){
            try {
                makePath(board[Math.floor(Math.random()*board.length)])
                success = true
            }
            catch(error){
                console.error(error)
                board.forEach(spot => {
                            spot.up = undefined;
                            spot.right = undefined;
                            spot.down = undefined;
                            spot.left = undefined;
                            spot.connections = 0; 
                        });
                success = false
            }
        }

        

        // Apply Fruchterman-Reingold algorithm
        fruchtermanReingoldLayout(board, 550, 550);

        // makePath(board[Math.floor(Math.random()*board.length)])

        adjustRelativeDirections(board);

        // assign starting spot
        start = board.filter((e) => e.connections >= 4 && (e.type == "Bad" || e.type == "Good" || e.type == undefined))
        if (start.length == 0){
            start = board.filter((e) => e.connections >= 3 && (e.type == "Bad" || e.type == "Good" || e.type == undefined))
        }
        hold = new Start(start[0].id, start[0].x, start[0].y);
        hold.up = start[0].up
        hold.right = start[0].right
        hold.down = start[0].down
        hold.left = start[0].left
        hold.connections = start[0].connections
        board[start[0].id-1] = hold

        // center(board)

        board.forEach(spot => {
            directions = [board[spot.up-1], board[spot.right-1], board[spot.down-1], board[spot.left-1]]
            directions.forEach(element => {
                if (element != undefined){
                    spot.dir.push(element)
                }
            });
            spot.up = undefined
            spot.right = undefined
            spot.down = undefined
            spot.left = undefined
            spot.connections = 0
        });
        assignDirections(board)
        

        // adjustPositions(board, 550, 550)

        board.forEach(spot => {
            directions = [board[spot.up-1], board[spot.right-1], board[spot.down-1], board[spot.left-1]]
            
            hold = directions.filter((conn) => conn != undefined);
            // console.log(directions)
            spot.dir = []
        });

    function fruchtermanReingoldLayout(spots, width, height, iterations = 100, area = 90000) {
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
                directions = [board[v.up-1], board[v.right-1], board[v.down-1], board[v.left-1]]
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
            directions = [board[spot.up-1], board[spot.right-1], board[spot.down-1], board[spot.left-1]]
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

    function assignDirections(spots) {
        // Initialize each node's directional properties
        spots.forEach(node => {
            node.left = null;
            node.right = null;
            node.up = null;
            node.down = null;
        });
    
        // Helper function to calculate direction based on location
        function calculateDirection(node1, node2) {
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
    
            if (absDx > absDy) {
                return dx > 0 ? 'right' : 'left';
            } else {
                return dy > 0 ? 'down' : 'up';
            }
        }
    
        // Store potential connections with their directions and angles
        let potentialConnections = [];
    
        spots.forEach(node => {
            node.dir.forEach(edge => {
                const direction = calculateDirection(node, edge);
                const angle = Math.atan2(edge.y - node.y, edge.x - node.x);
                potentialConnections.push({ from: node.id, to: edge.id, direction, angle });
            });
        });
    
        // Sort connections by angle to determine priority
        potentialConnections.sort((a, b) => a.angle - b.angle);
    
        // Helper function to assign a direction
        function assignDirection(from, to, direction) {
            const oppositeDirection = {
                left: 'right',
                right: 'left',
                up: 'down',
                down: 'up'
            }[direction];
            
            const fromNode = spots.find(node => node.id === from);
            const toNode = spots.find(node => node.id === to);
    
            // Assign direction if not already assigned
            if (fromNode[direction] === null) {
                fromNode[direction] = to;
            }
            if (toNode[oppositeDirection] === null) {
                toNode[oppositeDirection] = from;
            }
        }
    
        // Assign directions based on the most ideal connections
        spots.forEach(node => {
            node.dir.forEach(edge => {
                const direction = calculateDirection(node, edge);
                assignDirection(node.id, edge.id, direction);
            });
        });
    
        // Function to ensure each node's dir array connections are correctly assigned
        function ensureConnections() {
            let hasChanges = false;
    
            spots.forEach(node => {
                node.dir.forEach(edge => {
                    const direction = calculateDirection(node, edge);
                    const oppositeDirection = {
                        left: 'right',
                        right: 'left',
                        up: 'down',
                        down: 'up'
                    }[direction];
                    
                    const edgeNode = spots.find(n => n.id === edge.id);
                    
                    // Ensure mutual bidirectional assignment
                    if (node[direction] === null) {
                        node[direction] = edge.id;
                        hasChanges = true;
                    }
                    if (edgeNode[oppositeDirection] === null) {
                        edgeNode[oppositeDirection] = node.id;
                        hasChanges = true;
                    }
                });
            });
    
            return hasChanges;
        }
    
        // Ensure all nodes are connected as per the dir array requirements
        const maxIterations = 300;
        let iterations = 0;
        let hasChanges;
        do {
            // hasChanges = ensureConnections();
            // console.log(hasChanges)
            iterations++;
        } while (hasChanges && iterations < maxIterations);
        if (hasChanges){
            reset()
        }
        // Final verification: Ensure no node is missing necessary connections
        spots.forEach(node => {
            node.dir.forEach(edge => {
                const direction = calculateDirection(node, edge);
                const oppositeDirection = {
                    left: 'right',
                    right: 'left',
                    up: 'down',
                    down: 'up'
                }[direction];
                
                if (node[direction] !== edge.id) {
                    console.error(`Error: Node ${node.id} should have a ${direction} connection to ${edge.id}.`);
                    edge[oppositeDirection] = null
                    console.log(node)
                    console.log(edge)

                    // [{ direction: 'up', spot: board[node.up-1]}, { direction: 'right', spot: board[spot.right-1]}, { direction: 'down', spot: board[spot.down-1]}, { direction: 'left', spot: board[.left-1]}]
                    // reset()
                }
                const edgeNode = spots.find(n => n.id === edge.id);
                if (edgeNode[oppositeDirection] !== node.id) {
                    console.error(`Error: Node ${edge.id} should have a ${oppositeDirection} connection to ${node.id}.`);
                    node[direction] = null
                    // reset()
                }
            });
        });
    }
    
    
    
    
    
    
    
    

    function adjustPositions(spots, width, height, padding = 10, maxIterations = 100, moveStep = 1) {
        
        let iterations = 0;
    
        while (iterations < maxIterations) {
            let adjusted = false;
    
            spots.forEach(spot => {
                directions = [{ direction: 'up', spot: board[spot.up-1]}, { direction: 'right', spot: board[spot.right-1]}, { direction: 'down', spot: board[spot.down-1]}, { direction: 'left', spot: board[spot.left-1]}]
                directions.forEach(conn => {
                    if (conn.spot != undefined){
                        const dx = conn.spot.x - spot.x;
                        const dy = conn.spot.y - spot.y;
        
                        let moveX = 0;
                        let moveY = 0;
        
                        switch (conn.direction) {
                            case 'right':
                                if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) {
                                    moveX = moveStep;
                                }
                                break;
                            case 'left':
                                if (dx >= 0 || Math.abs(dy) > Math.abs(dx)) {
                                    moveX = -moveStep;
                                }
                                break;
                            case 'up':
                                if (dy >= 0 || Math.abs(dx) > Math.abs(dy)) {
                                    moveY = -moveStep;
                                }
                                break;
                            case 'down':
                                if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) {
                                    moveY = moveStep;
                                }
                                break;
                        }
        
                        if (moveX !== 0 || moveY !== 0) {
                            conn.spot.x = Math.max(padding, Math.min(conn.spot.x + moveX, width - padding));
                            conn.spot.y = Math.max(padding, Math.min(conn.spot.y + moveY, height - padding));
                            adjusted = true;
                        }
                    }
                });
            });
    
            if (!adjusted) {
                break; // Stop if no adjustments were made
            }
    
            iterations++;
        }
    
        // Update actual positions
        spots.forEach(spot => {
            spot.x = Math.round(spot.x);
            spot.y = Math.round(spot.y);
        });
    }

    // Function to find if
    // all nodes can be visited from X
    function canVisitAllNodes(arr, X, n) {
        let q = [];
        let visited = new Array(n).fill(false);
        q.push(X);
        visited[X] = true;
        let count = 0;

        // Loop to implement BFS
        while (q.length > 0) {
            let size = q.length;
            for (let i = 0; i < size; i++) {
                let curr = q.shift();
                count++;
                directions = [arr[curr].up-1, arr[curr].right-1, arr[curr].down-1, arr[curr].left-1]
                directions = directions.filter((e) => e != NaN)
                for (let j of directions) {
                    if (visited[j] == false) {
                        q.push(j);
                        visited[j] = true;
                    }
                }
            }
        }

        // Check if all nodes are visited
        if (count == n) 
            return true; 
        return false;
    }

    function connectionNum(spot) {
        return spot.connections >= 2
    }

    return board;
}

module.exports.spots = board;
module.exports.reset = reset;