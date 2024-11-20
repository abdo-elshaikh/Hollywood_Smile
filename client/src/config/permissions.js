// client/config/permissions.js
const allPermissions = {
    // user permissions
    User: ['getUsers', 'getuser', 'updateUser', 'deleteUser', 'getUserByEmail', 'changeUserStatus', 'changeUserRole'],
    // appointment permissions
    appointment: ['getAppointments', 'createAppointment', 'updateAppointment', 'deleteAppointment', 'getAppointmentsByPatient', 'getAppointmentsByDoctor',  'updateAppointmentStatus'],
    // billing permissions
    billing: ['getBillings', 'createBilling', 'updateBilling', 'deleteBilling', 'getBillingByPatient', 'applyDiscount', 'addPayment', 'getBillingById'],
    // department permissions
    department: ['getDepartments', 'createDepartment', 'updateDepartment', 'deleteDepartment', 'getDepartmentById'],
    // online booking permissions
    onlineBooking: ['getOnlineBookings', 'changeStatusBooking', 'updateOnlineBooking', 'deleteOnlineBooking', 'getOnlineBookingById'],
    // patient permissions
    patient: ['getPatients', 'createPatient', 'updatePatient', 'deletePatient', 'getPatientById', 'getPatientByName', 'getPatientByCode', 'getPatientByPhone'],
    // role permissions
    permission: ['getRolePermissions', 'addRolePermissions', 'updateRolePermissions', 'getPermissionsByRole'],
    // service permissions
    service: ['getServices', 'createService', 'updateService', 'deleteService', 'getServiceById', 'addManyServices'],
    // treatment permissions
    treatment: ['getAllTreatments', 'getTreatmentById', 'updateTreatment', 'deleteTreatment', 'createTreatment'],
    // treatment category permissions
    treatmentCategory: ['getAllTreatmentCategories', 'getTreatmentCategoryById', 'createTreatmentCategory', 'updateTreatmentCategory', 'deleteTreatmentCategory'],
    // treatment plan permissions
    treatmentPlan: ['getAllTreatmentPlans', 'getTreatmentPlanById', 'createTreatmentPlan', 'updateTreatmentPlan', 'deleteTreatmentPlan'],
    // handle errors
    error: ['handleError'],
    // all permissions
    all: ['*']
};

export default allPermissions;
