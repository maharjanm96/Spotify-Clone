const router = require('express').Router();
const { User } = require('../models/user');
const { Song, validate } = require('../models/song');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin')
const validObjectId = require('../middlewares/validObjectId')

//CREATE SONG
router.post("/", admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    const song = await Song(req.body).save();
    res.status(201).send({ data: song, message: "Song Created Successfully." });

})

//GET ALL SONGS
router.get("/", async (req, res) => {
    const songs = await Song.find();
    return res.status(400).send({ data: songs });
});

//UPDATE SONGS
router.put("/:id", [validObjectId, admin], async (req, res) => {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ data: song, message: "Song Updated Successfully." })

})




//DELETE SONG BY ID
router.delete("/:id", [validObjectId, admin], async (req, res) => {
    const song = await Song.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Song Deleted Successfully." });
});

//LIKE SONG
router.put("/like/:id", [validObjectId, auth], async (req, res) => {
    let resMessage = "";
    const song = await Song.findById(req.params.id);
    if (!song)
        return res.status(400).send({ message: "Song Does Not Exist." });

    const user = await User.findById(req.user._id)
    const index = user.likedSongs.indexOf(song._id);
    if (index === -1) {
        user.likedSongs.push(song._id);
        resMessage = "Added To Your Liked Songs."
    } else {
        user.likedSongs.splice(index, 1);
        resMessage = "Removed From Your Liked Songs.";
    }
    await user.save();
    res.status(200).send({ message: resMessage });
});



//GET ALL LIKED SONGS
router.get("/like", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const song = await Song.find({ _id: user.likedSongs });
    res.status(200).send({ data: song })
});


module.exports = router;