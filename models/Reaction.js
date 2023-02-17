const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId:{
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },

        userName: {
            type: String,
            required: true,
            maxlength: 280,
        },

        reactionBody: {
            type: String,
            required: true,
            maxlength: 280, 
        },

        createAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFomat(createdAtVal)
        }
    }      
)

reactionSchema.virtual('reactionCount').get(function() {
    return moment (this.createAt).format('MMM DD, YYYY [at] hh:mm a');
});

module.exports = reactionSchema; 