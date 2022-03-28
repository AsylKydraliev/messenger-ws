const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const mongoose = require("mongoose");
const config = require("./config");
const users = require('./routes/users');
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();

require('express-ws')(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', users);

const activeConnections = {};
let username = '';
let token = '';
let messages = [];

app.ws('/chat', (ws, req, next) => {
    const id = nanoid();
    console.log('client connected id = ', id);
    activeConnections[id] = ws;

    ws.on('message', async (msg) => {
        try {
            const decodedMsg = JSON.parse(msg);

            const message = new Message({
                message: decodedMsg.message.message,
                userId: decodedMsg.message.username._id,
                username: decodedMsg.message.username.displayName,
            })

            await message.save();

            switch (decodedMsg.type) {
                case 'LOGIN':
                    console.log('login')
                    if(!decodedMsg.token){
                        ws.on('close', () => {
                            console.log('client disconnected! id = ', id);
                            delete activeConnections[id];
                        })
                    }

                    break;
                case 'SEND_MESSAGE':
                    const result = await Message.find().limit(30);
                    Object.keys(activeConnections).forEach(id => {
                        const conn = activeConnections[id];
                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            message: result,
                        }))
                    })
                    break;
                case 'GET_MESSAGES':
                    const messages = await Message.find().limit(30);
                    Object.keys(activeConnections).forEach(id => {
                        const conn = activeConnections[id];
                        conn.send(JSON.stringify({
                            type: 'ALL_MESSAGES',
                            message: messages,
                        }))
                    })
                    break;
                default:
                    console.log('Unknown type: ', decodedMsg.type);
            }
        }catch (e){
            next(e)
        }
    });

    ws.on('close', () => {
        console.log('client disconnected! id = ', id);
        delete activeConnections[id];
    })
});

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    })

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(e => console.error(e));

