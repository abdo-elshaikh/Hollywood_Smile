const Doctors = require('../models/Doctors');

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctors.find()
            .populate('socialLinks')
            .populate('workingHours')
            .populate('rating');

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctors.findById(req.params.id).populate('socialLinks')
            .populate('rating', 'name stars');

        if (doctor) {
            return res.status(200).json(doctor);
        }
        res.status(404).json({ message: 'Doctor not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctor', error });
    }
};

const createDoctor = async (req, res) => {
    try {
        const doctor = await Doctors.create(req.body);
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create doctor', error });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctors.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (doctor) {
            return res.status(200).json(doctor);
        }
        res.status(404).json({ message: 'Doctor not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update doctor', error });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctors.findByIdAndDelete(req.params.id);
        if (doctor) {
            return res.status(200).json(doctor);
        }
        res.status(404).json({ message: 'Doctor not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete doctor', error });
    }
};

const addRating = async (req, res) => {
    try {
        const doctor = await Doctors.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const newRatings = req.body || [];
        if (!Array.isArray(newRatings)) {
            return res.status(400).json({ message: 'Ratings should be an array' });
        }

        const existingRatings = doctor.rating;
        const updatedRatings = existingRatings.map(existingRating => {
            const newRating = newRatings.find(newRating => newRating.name === existingRating.name);
            if (newRating) {
                return {
                    ...existingRating,
                    stars: (existingRating.stars + newRating.stars) / 2,
                };
            }
            return existingRating;
        });

        newRatings.forEach(newRating => {
            if (!updatedRatings.find(rating => rating.name === newRating.name)) {
                updatedRatings.push(newRating);
            }
        });

        doctor.rating = updatedRatings;
        await doctor.save();
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add rating', error: error.message });
    }
};

const getAverageRating = async (req, res) => {
    try {
        const doctor = await Doctors.findById(req.params.id);
        if (doctor) {
            if (doctor.rating.length === 0) {
                return res.status(200).json({ averageRating: 0 });
            }

            const totalStars = doctor.rating.reduce((acc, item) => acc + item.stars, 0);
            const averageRating = totalStars / doctor.rating.length;
            res.status(200).json({ averageRating });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to get average rating', error });
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    addRating,
    getAverageRating,
};
