const router = require('express').Router();

const {
    getThought,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtController.js');

// api/thought

router
.route('/')
.get(getThought)
.get(getSingleThought)
.post(createThought);

// api/thought/:id
router
.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

// api/thought/:thoughtId/reactions
router
.route('/:thoughtId/reactions')
.post(addReaction);

// api/thought/:thoughtId/reactions/:reactionId
router
.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;