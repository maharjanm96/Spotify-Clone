const router = require('express').Router();
const { Playlist, validate } = require("../models/playlist");
const { Song } = require("../models/song");
const { User } = require("../models/user")
const auth = require("../middlewares/auth");
const validObjectId = require("../middlewares/validObjectId");
const Joi = require('joi');

//CREATE PLAYLIST
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    const user = await User.findById(req.user._id);
    const playlist = await Playlist({ ...req.body, user: user._id }).save();
    user.playLists.push(playlist._id);
    await user.save();

    res.status(201).send({ data: playlist })


})

//EDIT PLAYLIST BY ID
router.put("/edit/:id", [validObjectId, auth], async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().allow(""),
        img: Joi.string().allow("")
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist)
        return res.status(404).send({ message: "Playlist Not Found" });

    const user = await User.findById(req.user._id);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User don't have access to EDIT." })

    playlist.name = req.body.name;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();

    res.status(200).send({ message: "Updated Successfully." })

})

//ADD SONGS TO PLAYLIST
router.put("/add-song", auth, async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().required().label("Playlist ID"),
        songId: Joi.string().required().label("Song ID"),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);

    if (!user._id.equals(playlist.user)) {
        return res.status(401).send({ message: "User doesn't have access to add songs." });
    }

    if (playlist.songs.includes(req.body.songId)) {
        return res.status(400).send({ message: "Song already exists in the playlist." });
    } else {
        playlist.songs.push(req.body.songId);
    }

    await playlist.save();

    res.status(200).send({
        data: playlist,
        message: "Added to the playlist.",
    });
});


//REMOVE SONG FROM PLAYLIST
router.put("/remove-song", auth, async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message })
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);

    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User don't have access to REMOVE." })

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Removed From Playlist." })

})

//USER FAVOURITE PLAYLISTS
router.get("/favourite", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlists = await Playlist.find({ _id: user.playLists });
    res.status(200).send({ data: playlists });
});

//GET RANDOM PLAYLIST
router.get("/random", auth, async (req, res) => {
    const playlists = await Playlist.aggregate([{ $sample: { size: 10 } }])
    res.status(200).send({ data: playlists });
})


//GET PLAYLIST BY ID AND SONGS
router.get("/:id", [validObjectId, auth], async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist)
        return res.status(404).send("Not Found");

    const song = await Song.find({ _id: playlist.songs });
    res.status(200).send({ data: { playlist, song } });
})

//GET ALL PLAYLISTS
router.get("/", auth, async (req, res) => {
    const playlists = await Playlist.find();
    res.status(200).send({ data: playlists });

})

//DELETE ALL PLAYLIST BY ID
router.delete("/:id", [validObjectId, auth], async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.params.id);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User don't have access to Delete." })

    const index = user.playLists.indexOf(req.params.id);
    user.playLists.splice(index, 1);
    await user.save();
    //await playlist.remove();
    await Playlist.deleteOne({ _id: req.params.id }); // Use deleteOne() instead of remove()
    res.status(200).send({ message: "Removed From Library." });
})




module.exports = router;