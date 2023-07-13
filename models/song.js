const mongoose = require('mongoose');
const Joi = require('joi');

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    artist: {
        type: String,
        required: [true, 'Artist is Required']
    },
    song: {
        type: String,
        required: [true, 'Song is Required']
    },
    img: {
        type: String,
        required: [true, 'Image is Required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is Requried.']
    }
})

const validate = (song) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        artist: Joi.string().required(),
        song: Joi.string().required(),
        img: Joi.string().required(),
        duration: Joi.number().required()
    });
    return schema.validate(song);
}

const Song = mongoose.model("song", songSchema);

module.exports = { Song, validate };