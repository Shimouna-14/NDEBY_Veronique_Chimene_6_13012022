const Sauce = require("../models/sauce");
const fs = require("fs");

exports.allSauces = (req, res, next) => {
    Sauce.find()
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(400).json({error})})
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => {res.status(201).json({message : "Sauce created !"})})
        .catch((error) => {res.status(400).json({error})})
};

exports.oneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {res.status(200).json(sauce)})
        .catch((error) => {res.status(404).json({error})});
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({imageUrl: req.body.imageUrl})
            const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            } : { ...req.body };
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => {res.status(200).json({message: "Sauce updated successfully!"})})
            .catch((error) => {res.status(400).json({error})});
        })
    })
    .catch((error) => {res.status(500).json({error})});

};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce deleted!'}))
            .catch((error) => res.status(400).json({error}));
        });
    })
    .catch((error) => res.status(500).json({error}));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) =>{
        if (!sauce.usersLiked.includes(req.body.userId) && req.body.like == 1){
            Sauce.updateOne({$push: {usersLiked: req.body.userId}, $inc: {likes: 1}})            
            .then(() => {res.status(201).json({message : "Sauce liked !"})})
            .catch((error) => {res.status(400).json({error})});
        }
        if (sauce.usersLiked.includes(req.body.userId) && req.body.like == 0){
            Sauce.updateOne({$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
            .then(() => {res.status(201).json({message : "Like removed !"})})
            .catch((error) => {res.status(400).json({error})});
        }

        if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like == -1){
            Sauce.updateOne({$push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}})
            .then(() => {res.status(201).json({message : "Sauce disliked !"})})
            .catch((error) => {res.status(400).json({error})});
        }
        if (sauce.usersDisliked.includes(req.body.userId) && req.body.like == 0){
            Sauce.updateOne({$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
            .then(() => {res.status(201).json({message : "Dislike removed !"})})
            .catch((error) => {res.status(400).json({error})});
        }
    })
    .catch((error) => {res.status(500).json({error})});
};