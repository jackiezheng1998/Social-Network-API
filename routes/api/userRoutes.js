const router = require('express'). Router();

const {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,

} =require('../../controllers/userController');

// Geting all users 
// /api/users
router.route('/')
.get(getAllUsers)
.post(createUser);

// Getting single user 
// /api/users/:userId
router.route('/:userId')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser);

module.exports = router;