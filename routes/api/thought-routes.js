const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

// GET all thoughts
router.get("/", async (req, res) => {
  try {
    const findThought = await Thought.find().select("-__v");
    res.status(200).json(findThought);
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET thought by ID
router.get("/:id", async (req, res) => {
  try {
    const thoughtById = await Thought.findOne({
      _id: req.params.id,
    }).select("-__v");
    res.status(200).json(thoughtById);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST - create thought
router.post("/", async (req, res) => {
  try {
    const createThought = await Thought.create(req.body);
    const addToUser = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thought_text: createThought } },
      {
        new: true,
      }
    );

    res.status(200).json(addToUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT - update thought
router.put("/:id", async (req, res) => {
  try {
    const updateThought = await Thought.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    ).select("-__v");
    res.status(200).json(updateThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE thought
router.delete("/:id", async (req, res) => {
  try {
    const deleteThought = await Thought.findOneAndDelete({
      _id: req.params.id,
    }).select("-__v");
    res.status(200).json(deleteThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const addReactionToThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      {
        new: true,
      }
    ).select("-__v");

    res.status(200).json(addReactionToThought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE reaction by reactionID
router.delete("/:thoughtId/:reactionId", async (req, res) => {
  try {
    const addReactionToThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      {
        new: true,
      }
    ).select("-__v");

    res.status(200).json(addReactionToThought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
