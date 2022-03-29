const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const mongoose = require("mongoose");
const config = require("./config");
const users = require('./routes/users');
const Message = require("./models/Message");
const User = require("./models/User");

const app = express();

require('express-ws')(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', users);

const activeConnections = {};

app.get('/chat', async (req, res) => {
    const messages = await Message.find().sort({_id: -1}).limit(30);
    return res.send(messages)
});

app.ws('/chat', async (ws, req, next) => {
    const id = nanoid();
    console.log('client connected id = ', id);
    activeConnections[id] = ws;

    ws.on('message', async (msg) => {
        try {
            const decodedMsg = JSON.parse(msg);

            if(decodedMsg.type === 'LOGIN'){
                const user = await User.findOne({token: decodedMsg.token});

                if(decodedMsg.token !== user.token){
                    ws.on('close', () => {
                        console.log('client disconnected! id = ', id);
                        delete activeConnections[id];
                    })
                }
            }

            const message = new Message({
                message: decodedMsg.message.message,
                userId: decodedMsg.message.username._id,
                username: decodedMsg.message.username.displayName,
            })

            await message.save();

            switch (decodedMsg.type) {
                case 'SEND_MESSAGE':
                    const result = await Message.find().sort({_id: -1}).limit(30);
                    Object.keys(activeConnections).forEach(id => {
                        const conn = activeConnections[id];
                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            message: result,
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

