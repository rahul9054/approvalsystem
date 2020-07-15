const mongoose=require('mongoose');
var applicationSchema=new mongoose.Schema({
    filename:{
        type:String,
        require: true
    },
    descrption:{
        type:String, 
        default:'NA'       
    },
    Created_By:{
        type:String,
        require: true,
    },
    Approved_from:{
        type: [String],
    },  
    Pending_from:{
        type: [String],
        
    },
    Rejected_from:{
        type: [String],
        
    },
    Date_created :{
        type: String,
        require: true,
    }
});
module.exports=mongoose.model("application",applicationSchema);