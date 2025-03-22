const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
    host: 'EldmereSMP.aternos.me',
    port: 62921,
    username: 'EldBot'
});

bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
    console.log("✅ EldBot has joined the server!");
    bot.chat("🤖 EldBot is online!");
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const args = message.split(' ');
    const command = args[0].toLowerCase();

    if (command === '/eldbot') {
        if (args[1] === 'mine' && args.length >= 4) {
            mineBlock(args[2], parseInt(args[3]));
        } else if (args[1] === 'chop') {
            chopWood();
        } else if (args[1] === 'afk') {
            afkAction();
        } else if (args[1] === 'goto' && args.length === 5) {
            travelTo(parseInt(args[2]), parseInt(args[3]), parseInt(args[4]));
        } else if (args[1] === 'balance') {
            checkCurrency();
        } else if (args[1] === 'earn') {
            earnCurrency();
        } else if (args[1] === 'help') {
            bot.chat("📜 Commands: mine, chop, afk, goto, balance, earn.");
        } else {
            bot.chat("❌ Unknown command! Type '/eldbot help' for commands.");
        }
    }
});

function mineBlock(block, amount) {
    bot.chat(`⛏ Mining ${amount} ${block}...`);
    // Add mining logic
}

function chopWood() {
    bot.chat("🌲 Chopping wood...");
    // Add tree chopping logic
}

function afkAction() {
    bot.chat("🌀 Moving randomly to avoid AFK kick...");
    // Random movement logic
}

function travelTo(x, y, z) {
    bot.chat(`🚀 Traveling to ${x}, ${y}, ${z}...`);
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
}

let currency = 100;

function checkCurrency() {
    bot.chat(`💰 You have ${currency} EldCoins.`);
}

function earnCurrency() {
    const earned = Math.floor(Math.random() * 20) + 5;
    currency += earned;
    bot.chat(`🎉 Earned ${earned} EldCoins! New balance: ${currency}`);
}

bot.on('error', console.error);
bot.on('end', () => console.log("❌ EldBot disconnected."));
