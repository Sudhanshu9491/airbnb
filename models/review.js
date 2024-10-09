const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;    

const  reviewSchema = new Schema({
    Comment:String,
    rating :{
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:Data,
        default:Date.now()
    },
    reviews:[
        {
            type:Schema.Types.ObjectId, ref:'Review',

        }
    ]
});

module.exports = mongoose.model('Review', reviewSchema);