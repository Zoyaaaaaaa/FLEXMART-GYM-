const Schema = mongoose.Schema;


const ratingSchema = new Schema({
    comment: {
        type: String,
        default: "amazing", 
    },
    rating: {
        type: Number,
        default: 0 
    },
   
});

module.exports = mongoose.model("Rating", ratingSchema);
