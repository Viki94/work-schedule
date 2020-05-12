var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HallSchema = new Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    sittingPlaces: {
        type: String
    },
    isAvailable: {
        type: Number,
        default: 1
    },
    active: {
        type: Number,
        default: 1
    }
});

var Hall = mongoose.model('Hall', HallSchema);
module.exports = Hall;