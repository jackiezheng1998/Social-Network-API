const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

// Aggregate function to count the number of thoughts

const thoughtCount = async () =>
    Thought.aggregate()
        .count('thoughtCount')
        .then((numberOfThought) => numberOfThought);


const reactionCount = async (thoughtId) =>
    Thought.aggregate([
        {
            $match: {
                _id: ObjectId(thoughtId)
            }
        },
        {
            $unwind: '$reactions'
        },
        {
            $group: {
                _id: ObjectId(thoughtId),
                reactionNum: { $count: '$reactions' }
            }
        }
    ])

module.exports = {

    // Getting all thoughts
    getThought(req, res) {
        Thought.find({})
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                    thoughtCount: await thoughtCount(),
                }
                return res.json(thoughtObj)
            })
            .catch((err) => res.status(500).json(err));
    },

    // Getting a single thought by ID
    getSingleThought(req, res) {
        Thought.findOne({ id: req.params.thoughtId })
            .select('-__v')
            .then(async (thought) =>
                !thought
                    ? res.status(404).json({ message: 'There is no thought with this ID' })
                    : res.json({
                        thought,
                        reactionCount: await reactionCount(req.params.thoughtId),
                    })
            )
            .catch((err) => res.status(500).json(err));
    },

    // Creating a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then(async (thought) => {
                try {
                    const user = await User.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $push: { thoughts: thought._id } },
                        { new: true }
                    );
                    res.json(thought);
                } catch (err) {
                    console.log(err);
                    res.status(404).json(err);
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Updating a thought by ID
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'Thought not found' });
                }
                res.json(thought);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    // Deleting a thought by ID
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought exists' })
                    : res.json({ message: 'Thought deleted' })
                    )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            },); 
    },

    // Adding a reaction to a thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reaction: req.body } },
            { runValidator: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this Id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
        
    // Removing a reaction from thought 
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reaction: { reactionId: { $In: [req.params.reactionId] } } } },
            { runValidator: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this Id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};