const nodeWebCam = require('node-webcam');
const fs = require('fs')

const readline = require('readline')
const prompt = require('prompt-sync')();
const io = require("socket.io-client");
const ss = require('socket.io-stream');

// const socket = io("http://159.89.120.211:3000");
const socket = io("http://159.89.120.211:3000", {
    pingTimeout: 2000 // 60 seconds
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var joined = false


let name = prompt("Please enter your name: ");
let img = prompt("Please enter your icon (image address): ");

console.log("Connecting to the server...");


socket.on("connect", () => {
    if (!joined) {
        socket.emit("join", name, img)
        joined = true;
    }
    else {
        socket.emit("rejoin", name, img)
    }
});

socket.on("disconnect", (reason) => {
    console.log("[INFO]: Client disconnected, reason: %s", reason);
});

socket.on("p1", async () => {
    await askQuestion("Press enter when everyone is in")
    socket.emit("playerturn")
});

socket.on("print", async (text) => {
    console.log(text);
});

socket.on("printchoice", async (text, options) => {
    console.log(text);
    options.forEach(function (element, i) {
        console.log('['+ i +']: ' +element);
    });
});

socket.on("update", () => {
});

socket.on("choice", async (options) => {
        // rl.
        // rl.question('Enter your input: ', (selection) => {
        // });
        selection = await getNumberResponse(options)
        if (selection == 0){
            socket.emit("items");
        }
        else{
            socket.emit('move', options, selection);
        }
});

socket.on("itemchoice", async (options) => {
    selection = await getNumberResponse(options)
    if (selection == 0){
        socket.emit('actions')
    }
    else{
        socket.emit('useitem', selection);
        // socket.emit('actions');
    }
});

socket.on("shopchoice", async (options) => {
    selection = await getNumberResponse(options)
    if (selection == 0){
    }
    else{
        socket.emit('buyitem', selection);
    }
    socket.emit('advance');
});

socket.on('playerchoice', async (options, response, index) => {
    selection = await getNumberResponse(options);
    socket.emit(response, selection, index);
});

socket.on('photo', (player) => {
    if (player.name == name && player.icon == img){
        var options = {
            width: 1280,
            height: 720, 
            quality: 100,
            delay: 0,
            saveShots: true,
            output: "jpeg",
            device: false,
            callbackReturn: "location"
        };

        // create instance using the above options
        var webcam = nodeWebCam.create(options);

        var path = `./images`;

        // create folder if and only if it does not exist
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        } 

        // capture the image
        webcam.capture(`./images/photo.${options.output}`, (err, data) => {
            const stream = ss.createStream();
            // const fileName = path.basename('./images/out.jpeg');

            // Emit the stream to the server with the file name
            ss(socket).emit('file-upload', stream, { fileName: 'photo.jpeg' });

            // Pipe the file's read stream to the stream
            fs.createReadStream('./images/photo.jpeg').pipe(stream);
        });

        // const filePath = path.join(__dirname, );

        // Create a read stream for the file
    }
});

async function getNumberResponse(options) {
    var selection = undefined
    do {
        selection = await askQuestion("Pick an action: ")
        if (!isNaN(selection)){
            selection = parseInt(selection)
        }
    } while (options[parseInt(selection)] == undefined);
    return selection
}

function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}