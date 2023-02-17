const {User, Thought} = require('../models');
const {ObjectId} = require('mongoose').Types;

module.exports = {
    // Getting all users
    getAllUsers(req, res){
        User.find({})
            .then((users) =>{
                console.log(users);
                res.json(users)
            })
            .catch((err)=>res.status(500).json(err))
    },

    // Getting a single user by ID
    getSingleUser(req, res){
        User.findOne({_id: req.params.userId})
        .select('--v')
        .populate({
            path: 'thoughts',
            model: 'user'    
        })
        .populate({
            path: 'friends',
            model: 'user'
        })
        .then((user) =>
        !user
            ? res.status(404).json({message: 'No user with that ID'})
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err)
        });
    },

    // Creating a new user
    createUser(req, res){
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) =>{
            console.log(err);
            return res.status(500).json(err);
        })
    }, 

    // Deleting a friend
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
        .then((user) =>
        !user
            ? res.status(404).json({message: "No user with that ID"})
            : Thought.deleteMany({_id: {$in: user.thoughts}})
        )
        .then(()=>
            res.json({message: 'User and thoughts deleted'}))
            .catch((err)=>{
                console.log(err)
                return res.status(500).json(err)
            })
    },

    // Updating a user
    updateUser(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((user) => {
            !user 
              ? res.status(404).json({message: "No user with that id!"})
              : res.json(user)
        })
        .catch((err) =>{
            console.log(err)
            return res.status(500).json(err);
        })
    }
}