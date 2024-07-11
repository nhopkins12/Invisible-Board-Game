const get3coins = function(player){
    console.log(player)
};



const fs = require('fs')

list = [{"title": "Get 3 coins", "function": "get3coins"}]
console.log(list)

fs.writeFileSync('./data/good.json', JSON.stringify(list), (error) => {
    if (error) {
        console.error(error);
        throw error;
    }});

eval(list[0].function+"(\"stevert\")")