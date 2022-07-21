const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Subscription = require("./Subscription")

const Event = mongoose.model("Event", new Schema({
    type: {
        type: String
    },
    tournament: {
        type: String
    },
    starts: {
        type: Date
    },
    ends: {
        type: Date
    },
    expireAt: {
        type: Date,
        expires: 60
    }
}), "events")


// STREAMS __________________________________________________________
Event.watch().on("change", async data => {
    try {
        if (data.operationType === "delete") {
            await Subscription.deleteMany({
                event: data.documentKey
            })
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = Event