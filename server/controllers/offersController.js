const Offers = require('../models/Offers');

const getOffers = async (req, res) => {
    try {
        const offers = await Offers.find();
        if (!offers) {
            return res.status(404).json({ message: 'No offers found' });
        }
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOffer = async (req, res) => {
    try {
        const newOffer = await Offers.create(req.body);
        if (!newOffer) {
            return res.status(400).json({ message: 'Error creating offer' });
        }
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOffer = async (req, res) => {
    try {
        const offer = await Offers.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) {
            return res.status(400).json({ message: 'Error updating offer' });
        }
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOffer = async (req, res) => {
    try {
        const offer = await Offers.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'No offer found' });
        }
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
