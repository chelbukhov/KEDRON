module.exports = {
    getChatID(msg) {
        return msg.chat.id
    },

    getProjectIDFromCommand(source) {
        return source.substr(5, source.length)
    },

    getRpIndexFromCommand(source) {
        return source.substr(4, source.length)
    },


    getRpIDFromCommand(source) {
        let RPID = 1 + Number(source.substr(4, source.length))
        return RPID
    }

}