const {nanoid} = require("nanoid");
const User = require("../models/User");
const Message = require("../models/Message");

const activeConnections = {};

module.exports =  async (ws, req, next) => {
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
                    if(!decodedMsg.message.username.token) return;

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
}