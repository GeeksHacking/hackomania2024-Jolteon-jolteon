const {v4} = require("uuid")

module.exports = {
    generateUUID: () => {
        return v4().slice(0, 8) + "-" + v4().slice(-8, -1)
    }
}
