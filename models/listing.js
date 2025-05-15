const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");

const Schema = mongoose.Schema;

const defaultImageURL = "https://unsplash.com/photos/a-large-swimming-pool-surrounded-by-palm-trees-_pPHgeHz1uk";


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum : ["Rooms","Iconic Cities","mountains","Farm","Camping","Arctic"],
    }
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing)
    {
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
