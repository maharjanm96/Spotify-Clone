const mongoose = require('mongoose');
const Joi = require('joi')

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: ObjectId, ref: "user", required: true },
    desc: { type: String },
    songs: { type: Array, default:[] },
    img: { type: String }

});

const validate = (playlist)=>{
    const schema = Joi.object({
        name:Joi.string().required(),
        user: Joi.string().required(),
        desc: Joi.string().allow(""),
        song: Joi.array().items(Joi.string()),
        name: Joi.string().allow(""),
    });

    return schema.validate(playlist)
}

const Playlist = mongoose.model("playlist", playlistSchema)

module.exports ={Playlist,validate}