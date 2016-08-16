/**
 * Created by yeshuijuan on 7/20/16.
 */
//person to person chat
exports.ppChat = function (socket, io) {

    socket.on('chat', function (from, to, msg) {
        io.emit('tina', { will: 'be received by everyone'});
        console.log('I received a private message by ', from, ' to:' + to, 'saying ', msg);
    });

    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
}

//group chat
exports.groupChat = function (socket,io) {


}

//system messages
exports.sysChat = function (socket,io) {


}