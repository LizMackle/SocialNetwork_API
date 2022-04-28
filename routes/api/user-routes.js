const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

// GET all users
router.get("/", async (req, res) => {
  await User.find({
    include: [{ model: Thought }],
  }).then((findAllUsers) => {
    res.json(findAllUsers);
  });
});

// GET single user by ID
router.get("/:_id", async (req, res) => {
  try {
    const userById = await User.findById({
      _id: req.params._id,
      include: [{ model: User }, { model: Thought }],
    });
    res.status(200).json(userById);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST - create new user
router.post("/", async (req, res) => {
  try {
    const createUser = await User.create(req.body);
    createUser;
    res.status(200).json(createUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT - update user by ID
router.put("/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    ).select("-__v");
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE user by ID
router.delete("/:_id", async (req, res) => {
  try {
    const findThoughts = await User.findOne({ _id: req.params._id });
    if (findThoughts.thoughts.length !== 0) {
      const userThoughts = findThoughts.thoughts;
      userThoughts.forEach(async (element) => {
        const deleteThoughts = await Thought.deleteOne({
          _id: element._id,
        });
        deleteThoughts;
      });
    }
    const deleteUser = await User.deleteOne({
      _id: req.params._id,
    });
    deleteUser;
    res.status(200).json({
      data: "deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST - add friend to users friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const addFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    console.log("add friend", addFriend);
    res.status(200).json(addFriend);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE friend from a users friend list
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const deleteFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    ).select("-__v");
    res.status(200).json(deleteFriend);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
