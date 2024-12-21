// ClinicContext.js (Frontend)
import React, { useState, createContext, useContext, useEffect, useMemo } from "react";
import axiosInstance from '../services/axiosInstance';

const ClinicContext = createContext();

export const useClinicContext = () => useContext(ClinicContext);

export const ClinicProvider = ({ children }) => {
    const [clinicInfo, setClinicInfo] = useState({});

    const defaultClinicInfo = {
        name: { en: "Hollywood Smile Center", ar: "هوليوود سمايل سنتر" },
        subtitle: { en: "Dr. Mohamed Mabrouk", ar: "د. محمد مبروك" },
        description: {
            en: "My Clinic is a state-of-the-art dental facility located in the heart of the city.",
            ar: "مركزي هو مركز طبي ممتاز في مدينة سمسطا."
        },
        logo: { light: "logo-light.png", dark: "logo-dark.png" },
        address: { en: "Smosta - Mohamed Sliman Street Front of Co-operation Building", ar: "سمسطا - ش محمود سليمان امام بنزينة التعاون" },
        zip: "Zip Code",
        phone: "+1 (123) 456-7890",
        email: "Email@placeholder.com",
        website: "https://placeholder.com",
        mapLink: "https://www.google.com/maps",
        primaryContact: "+1 (123) 456-7890",
        secondaryContact: "+1 (987) 654-3210",
        emergencyContact: "+1 (555) 555-5555",
        openHours: {
            saturday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            sunday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            monday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            tuesday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            wednesday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            thursday: { from: "9:00 AM", to: "5:00 PM", isClosed: false },
            friday: { from: "9:00 AM", to: "5:00 PM", isClosed: true },
        },
        achievements: [
            {
                icon: "Star",
                label: { en: "5-Star Rating", ar: "تقييم 5 نجوم" },
                description: {
                    en: "Rated 5 stars by over 1,000 satisfied patients.",
                    ar: "تم التقييم بـ 5 نجوم من قبل أكثر من 1,000 مريض راضٍ."
                },
                number: 5,
            },
            {
                icon: "People",
                label: { en: "Experienced Team", ar: "فريق ذو خبرة" },
                description: {
                    en: "Our team consists of highly skilled professionals.",
                    ar: "يتكون فريقنا من محترفين ذوي مهارات عالية."
                },
                number: 10,
            },
            {
                icon: "ThumbUp",
                label: { en: "High Success Rate", ar: "معدل نجاح مرتفع" },
                description: {
                    en: "Successful treatments and happy smiles.",
                    ar: "علاجات ناجحة وابتسامات سعيدة."
                },
                number: 15,
            },
            {
                icon: "MedicalServices",
                label: { en: "Comprehensive Services", ar: "خدمات شاملة" },
                description: {
                    en: "Offering a wide range of dental services for all ages.",
                    ar: "تقديم مجموعة واسعة من خدمات الأسنان لجميع الأعمار."
                },
                number: 20,
            },
        ],
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            tiktok: "",
        },
        onlineTimes: [
            {
                day: "Friday",
                from: "9:00 AM",
                to: "5:00 PM",
                isAvailable: false,
            },
            {
                day: "Saturday",
                from: "9:00 AM",
                to: "5:00 PM",
                isAvailable: true,
            },
            {
                day: "Sunday",
                from: "9:00 AM",
                to: "5:00 PM",
                isAvailable: true,
            },
        ]
    };

    useEffect(() => {
        axiosInstance.get('/clinics')
            .then((response) => {
                setClinicInfo(response.data);
            })
            .catch((error) => {
                console.error('Error fetching clinic info:', error);
                setClinicInfo(defaultClinicInfo);
            });
    }, []);

    const updatedClinicInfo = async (newClinicInfo) => {
        try {
            const response = await axiosInstance.put('/clinics', newClinicInfo);
            setClinicInfo(response.data);
        } catch (error) {
            console.error('Error updating clinic info:', error);
        }
    };

    const value = useMemo(() => ({
        clinicInfo,
        updatedClinicInfo,
    }), [clinicInfo]);

    return (
        <ClinicContext.Provider value={value}>
            {children}
        </ClinicContext.Provider>
    );
};
