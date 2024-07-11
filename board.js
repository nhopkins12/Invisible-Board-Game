
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('game-board');
    const svg = document.getElementById('connections');

    const totalSpots = 108; // Change this to dynamically set the number of spots
    const gridSize = Math.ceil(Math.sqrt(totalSpots)); // Calculate grid size (number of rows and columns)
    const spotSize = 40; // Size of each spot
    const spacing = 50; // Spacing between spots

    const spots = [];
    for (let i = 0; i < totalSpots; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = col * spacing + 20; // Calculate x position
        const y = row * spacing + 20; // Calculate y position
        spots.push({ id: i + 1, x, y });
    }

    // Create spots dynamically
    spots.forEach(spot => {
        const spotElem = document.createElement('div');
        spotElem.classList.add('spot');
        spotElem.style.left = `${spot.x}px`;
        spotElem.style.top = `${spot.y}px`;
        spotElem.dataset.id = spot.id;
        // spotElem.setAttribute('id', 'bad');
        board.appendChild(spotElem);
    });

    // Create connections dynamically (example: connect all adjacent spots)
    const directions = [
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: 1 },  // down
        { dx: 1, dy: 1 },  // diagonal down-right
        { dx: 1, dy: -1 }  // diagonal up-right
    ];

    spots.forEach((spot, index) => {
        directions.forEach(direction => {
            const targetX = spot.x + direction.dx * spacing;
            const targetY = spot.y + direction.dy * spacing;
            const targetSpot = spots.find(s => s.x === targetX && s.y === targetY);
            if (targetSpot) {
                drawLine(spot.x + 15, spot.y + 15, targetSpot.x + 15, targetSpot.y + 15);
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

    // Function to move character to a specific spot
    function moveCharacterToSpot(character, spotId) {
        const spot = document.querySelector(`.spot[data-id='${spotId}']`);
        if (spot) {
            spot.appendChild(character);
        }
    }

    // Create a character and place it on the initial spot
    const character = document.createElement('div');
    character.classList.add('character');
    moveCharacterToSpot(character, 1); // Move to spot 1 initially

    // Add event listeners or game logic to move the character
    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('spot')) {
            const spotId = e.target.dataset.id;
            moveCharacterToSpot(character, spotId);
        }
    });
});