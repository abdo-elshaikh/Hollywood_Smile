const Services = require('../models/Services');
const asyncHandler = require('express-async-handler');

const getServices = asyncHandler(async (req, res) => {
    const services = await Services.find({});
    if (services) {
        res.status(200).json(services);
    } else {
        res.status(404).json({ message: 'No services found' });
    }
});


const getServiceById = asyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    try {
        const service = await Services.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    
});

const createService = asyncHandler(async (req, res) => {
    const { title, description, details, price, duration, imageUrl, icon } = req.body;

    if (!title || !description || !price) {
        res.status(400);
        throw new Error('Please include all required fields');
    }

    const service = new Services({
        title,
        description,
        details,
        price,
        duration,
        imageUrl,
        icon,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
});

const updateService = asyncHandler(async (req, res) => {
    try {
        const service = await Services.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const deleteService = asyncHandler(async (req, res) => {
    const service = await Services.findById(req.params.id);

    if (service) {
        service.isActive = false;
        await service.save();
        res.status(200).json({ message: 'Service removed' });
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
});

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
