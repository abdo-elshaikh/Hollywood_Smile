const Services = require('../models/Services');

const getServices = async (req, res) => {
    try {
        const services = await Services.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const getServiceById = async (req, res) => {
    try {
        const service = await Services.findById(req.params.id);
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const createService = async (req, res) => {
    try {
        const service = await Services.create(req.body);
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Services.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) {
            res.status(404).json({ message: 'Service not found!' });
            return;
        }
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Services.findByIdAndDelete(req.params.id);
        if (!service) {
            res.status(404).json({ message: 'Service not found!' });
            return;
        }
        res.status(200).json(service);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
