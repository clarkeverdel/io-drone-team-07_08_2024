import dgram from 'node:dgram'

const args = process.argv.slice(2);
const shouldDebug = args.includes('--debug');

let client;
const PORT = 8889;
const DEBUG_PORT = 8890;

const connect = async () => {
    client = dgram.createSocket("udp4");
    client.bind(shouldDebug ? DEBUG_PORT : PORT);
};

const close = () => {
    client.close()
}

const commandResult = (message) => {
    return new Promise((resolve) => {
        client.once('error', function (e) {
            throw e;
        });

        client.once('message', (msg, info) => {
            console.log(msg.toString());
            resolve(msg.toString());
        });

        client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
            if (err) throw err;
        });
    });
};

//sending msg
async function sendCommand(commandStr) {
    try {
        console.log(`Sending command: ${commandStr}`);
        const result = await commandResult(commandStr);
        console.log('Resolved to ' + result + ' for command ' + commandStr);
        if (result.includes('error')) {

            throw commandErr;
        }
        return result;
    } catch (err) {
        throw err;
    }
}

async function main() {
    const commands = [
        'command',
        'takeoff',
        //'left 30',
        //‘cw 90’,
        //‘forward 100’,
        //'cw 90',
        //'down 40', // beginpad
        //'forward 320',
        // ‘forward 500’,
        //'cw 90',
        //'up 70',
        //'forward 100',
        //'cw 90',
        //'forward 350',
        'land',
    ];

    await connect()

    let delay = 1000;
    // let commandCode, commandTimeEst;
    for (const command of commands) {
        await sendCommand(command);
        // await Promise(reswolve => setTimeout(resolve, delay))
    }

    close(); //give time for last command to finish
}

main();
//connect()