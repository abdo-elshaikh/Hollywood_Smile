const Offers = require('../models/Offers');

const getOffers = async (req, res) => {
    try {
        const offers = await Offers.find();
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOffer = async (req, res) => {
    try {
        const offer = new Offers(req.body);
        const newOffer = await offer.save();
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOffer = async (req, res) => {
    try {
        const offer = await Offers.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOffer = async (req, res) => {
    try {
        const offer = await Offers.findByIdAndDelete(req.params.id);
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer,
};
