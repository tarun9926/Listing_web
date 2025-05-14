//require mongoose 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


//crating the listing schema
const listingSchema = new Schema({
    title:{
       type: String,
       required: true,
    },
    description: String,
    
    image: {
        type: String,
        default:
            "https://in.images.search.yahoo.com/yhs/view;_ylt=AwrKDaqWTYFn2FYqDzIO9olQ;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzE4NmZhMGI0ZDhmYTczNmFkNGRkYzk1NGI0NjY3MGU5BGdwb3MDNQRpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fyhs%2Fsearch%3Fp%3Dunsplash%26ei%3DUTF-8%26type%3Dtype80410-848365615%26fr%3Dyhs-sz-024%26hsimp%3Dyhs-024%26hspart%3Dsz%26param1%3D3807225850%26tt%3Dunsplash4%26imgurl%3Dhttps%253A%252F%252Fwww.bing.com%252Fimages%252Fsearch%253Fview%253DdetailV2%2526ccid%253DB91UiRcz%2526id%253D8D4B040FD260211F087CAD2FB5B43B45DFBB4CF2%2526thid%253DOIP.B91UiRczPwCzFVM1pv9UoQHaE8%2526mediaurl%253Dhttps%253A%252F%252Fimages.unsplash.com%252Fphoto-1655365225170-55d6b7d2d6d5%253Fixlib%253Drb-1.2.1%2526w%253D1080%2526fit%253Dmax%2526q%253D80%2526fm%253Djpg%2526crop%253Dentropy%2526cs%253Dtinysrgb%2526q%253Dunsplash%2526ck%253D3ABA7D26C4370DC228C428397D4CAB2A%2526idpp%253Drc%2526idpview%253Dsingleimage%2526form%253Drc2idp%26turl%3Dhttps%253A%252F%252Fsp.yimg.com%252Fib%252Fth%253Fid%253DOIP.B91UiRczPwCzFVM1pv9UoQHaE8%2526pid%253DApi%2526w%253D148%2526h%253D148%2526c%253D7%2526dpr%253D2%2526rs%253D1%26sigi%3DC3UieP9n502e%26sigt%3DWEVy.YXcdxn9%26sigit%3DvwaxgRvsg75C%26tab%3Dorganic%26ri%3D5&w=1080&h=1620&imgurl=images.unsplash.com%2Fphoto-1571023479098-1ed95127545e%3Fcrop%3Dentropy%26cs%3Dtinysrgb%26fit%3Dmax%26fm%3Djpg%26ixid%3DMnwxMjA3fDB8MXxzZWFyY2h8Mnx8cGhvdG9zfHwwfHx8fDE2MjE1NzEyMDE%26ixlib%3Drb-1.2.1%26q%3D80%26w%3D1080&rurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fphotos&size=411KB&p=unsplash&oid=186fa0b4d8fa736ad4ddc954b46670e9&fr2=&fr=yhs-sz-024&tt=100%2B+Photos+Pictures+%7C+Download+Free+Images+on+Unsplash&b=0&ni=21&no=5&ts=&tab=organic&sigr=Q_2DnqXAk8LQ&sigb=wrwA9o_uhuhR&sigi=iDtdGSFd1UY7&sigt=.HPX3EtsdNKW&.crumb=NPbbpFeIJlb&fr=yhs-sz-024&hsimp=yhs-024&hspart=sz&type=type80410-848365615&param1=3807225850",
        set : (v) => v === ""
         ? "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        },
    ],
    //this is for owner of the listing
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
   
});
//this is for if we are deleting the listing so also thats review will also deleted
listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

//creating model with the help of listingschema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;