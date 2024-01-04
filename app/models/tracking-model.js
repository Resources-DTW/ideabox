const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrackingSchema = new Schema({
    module: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postData: {
        type: Object,
        required: false
    },
    updatedBy: {
        type: Number,
        required: true
    },
    updatedByName: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Tracking", TrackingSchema);