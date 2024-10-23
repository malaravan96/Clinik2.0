// Types for filtering appointments in React Native
export type AppointmentFilter = {
    queryText: string;
    status: string;
    reasonForVisit: string;
  };
  
  // Types for appointment details
  export type Appointment = {
    [x: string]: any;
    appointmentId: string;
    providerId: string;
    patientId: string;
    
    appointmentDate: string | Date | null; 
    appointmentTime: string | Date | null;
    status: string | null;
    reasonForVisit: string;
    createdAt: string | Date | null; // Use string for date representation in mobile
    updatedAt: string | Date | null;
    type:string | any
  };
  
  // Props for updating an appointment
  export type UpdateAppointmentProps = {
    initialAppointmentData: Appointment;
    onUpdate: (data: Appointment) => void;
  };
  
  // API response structure for appointments with pagination
  export type AppoinmentApiResponse = {
    data: Appointment[];
    totalRecords: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number; // Metadata for pagination
  };
  