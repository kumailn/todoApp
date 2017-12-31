var mongoose = require("mongoose");

var todoSchema = mongoose.Schema(
    {
        content : String,
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    }
);

module.exports = mongoose.model("Todo", todoSchema);