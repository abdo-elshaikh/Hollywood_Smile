const Doctors = require('../models/Doctors');

const getDoctors = async (req, res) => {
    const doctors = await Doctors.find().populate('socialLinks')
    .populate('rating.user', 'name email');
    
    if (!doctors || !doctors.length) {
        res.status(404).json({ message: 'No doctors found' });
    } else {
        res.status(200).json(doctors);
    }
};

const getDoctorById = async (req, res) => {
    const doctor = await Doctors.findById(req.params.id).populate('socialLinks')
    .populate('rating.user', 'name email');
    if (doctor) {
        res.status(200).json(doctor);
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

const createDoctor = async (req, res) => {
    const doctor = await Doctors.create(req.body);
    if (doctor) {
        res.status(201).json(doctor);
    } else {
        res.status(400).json({ message: 'Failed to create doctor' });
    }
};

const updateDoctor = async (req, res) => {
    const doctor = await Doctors.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (doctor) {
        res.status(200).json(doctor);
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

const deleteDoctor = async (req, res) => {
    const doctor = await Doctors.findByIdAndDelete(req.params.id);
    if (doctor) {
        res.status(200).json(doctor);
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
};

const addRating = async (req, res) => {
    const { name, stars, comment, user } = req.body;
    const doctor = await Doctors.findById(req.params.id);
    if (doctor) {
        doctor.rating.push({ name, stars, comment, user });
        await doctor.save();
        res.status(201).json({ message: 'Rating added successfully', doctor });
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
}

const getAverageRating = async (req, res) => {
    const doctor = await Doctors.findById(req.params.id);
    if (doctor) {
        const totalStars = doctor.rating.reduce((acc, item) => acc + item.stars, 0);
        const averageRating = totalStars / doctor.rating.length;
        res.status(200).json({ averageRating });
    } else {
        res.status(404).json({ message: 'Doctor not found' });
    }
}

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    addRating,
    getAverageRating,
};