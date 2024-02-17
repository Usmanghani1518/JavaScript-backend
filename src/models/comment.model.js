import mongoose ,{Schema} from "mongoose"
import mongooseAggregatePagginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({

    content:{
        type:String,
        required:true,
        lowercase:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
},
    {timeseries:true})
    videoSchema.plugin(mongooseAggregatePagginate)

    export const Comment = mongoose.model("Comment",commentSchema)