const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;    

const reviewSchema = new Schema({
    comment: String,  // Field name should start with a lowercase
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    
});

module.exports = mongoose.model('Review', reviewSchema);