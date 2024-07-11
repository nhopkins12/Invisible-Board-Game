document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    update()
    updatePlayer()
    socket.on('update2', () => {
        location.reload();
    });

    socket.on('update', () => {

        var clear = document.getElementsByClassName('spot');
        for (let item of clear) {
            item.remove();
        }
        clear = document.getElementsByClassName('charspot');
        for (let item of clear) {
            item.remove();
        }
        clear = document.getElementsByClassName('playertext');
        for (let item of clear) {
            item.remove();
        }

        document.getElementById('connections').innerHTML = '';
        update()
    });

    socket.on('updatePlayers', () => {
        updatePlayer()
    });
});

// update()
function update(){
    console.log("updating")
    const boardy = document.getElementById('game-board');
    const svg = document.getElementById('connections');


    board = []
    fetch("/display")
    .then((response) => response.json())
    .then(function (json){ 
        console.log(json)
        board = json["board"];
        players = json["players"]
        npc = json["npc"]
        // Create spots dynamically
    console.log(board)
    board.forEach(spot => {
        const spotElem = document.createElement('div');
        spotElem.classList.add('spot');
        spotElem.style.left = `${spot.x}px`;
        spotElem.style.top = `${spot.y}px`;
        spotElem.dataset.id = spot.id;
        spotElem.classList.add(spot.type);
        boardy.appendChild(spotElem);

        const cdiv = document.createElement('div');
        cdiv.classList.add('charspot');
        cdiv.style.left = `${spot.x-5}px`;
        cdiv.style.top = `${spot.y-5}px`;
        cdiv.dataset.id = spot.id;
        boardy.appendChild(cdiv);
        updatePlayer()
    });

    board.forEach((spot, index) => {
        directions = [board[spot.up-1], board[spot.right-1], board[spot.down-1], board[spot.left-1]]
        directions.forEach(direction => {
            if(direction != undefined){
                const targetX = direction.x;
                const targetY = direction.y;
                const targetSpot = board.find(s => s.x === targetX && s.y === targetY);
                if (targetSpot) {
                    drawLine(spot.x + 15, spot.y + 15, targetSpot.x + 15, targetSpot.y + 15);
                }
            }
        });
    });

    function drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        svg.appendChild(line);
    }

    players.forEach(function(player, index) {
        const character = document.createElement('div');
        character.dataset.id = player['id']
        character.style.backgroundImage = "url("+ player["icon"] +")"
        character.classList.add('character');
        moveCharacterToSpot(character, player["location"]);
        console.log(board[player["location"]-1])

        const text = document.createElement('div');
        text.classList.add('playertext');
        if (index == 0){
            text.style.left = `2px`;
            text.style.top = `2px`;
        }
        else if (index == 1){
            text.style.right = `2px`;
            text.style.top = `2px`;
        }
        else if (index == 2){
            text.style.left = `2px`;
            text.style.bottom = `2px`;
        }
        else if (index == 3){
            text.style.right = `2px`;
            text.style.bottom = `2px`;
        }
        text.innerHTML = player["name"]+": "+player["coins"]
        
        player["objectives"].forEach( (objective) => {
            const circle = document.createElement('span');
            circle.classList.add('dot');
            if (objective){
                circle.style.backgroundColor = '#0ccf0c'
            }
            text.appendChild(circle)
        });
        boardy.appendChild(text);
    });

    npc.forEach(function(element, index){
        const character = document.createElement('div');
        character.dataset.id = element['id']
        character.style.backgroundImage = "url("+ element["icon"] +")"
        character.classList.add('character');
        character.classList.add('npc');
        moveCharacterToSpot(character, element["location"]);
    });
    });
}

function updatePlayer(){
    fetch("/display")
    .then((response) => response.json())
    .then(function (json){ 
        console.log(json)
        board = json["board"];
        players = json["players"]
        npc = json["npc"]
        players.forEach(player => {
            const character = document.querySelector(`.character[data-id='${player['id']}']`);
            moveCharacterToSpot(character, player["location"]);
        });
        npc.forEach(function(element, index){
            const character = document.querySelector(`.character[data-id='${element['id']}']`);
            moveCharacterToSpot(character, element["location"]);
        });
    });
}

function moveCharacterToSpot(character, spotId) {
    const spot = document.querySelector(`.charspot[data-id='${spotId}']`);
    if (spot) {
        spot.appendChild(character);
    }
}