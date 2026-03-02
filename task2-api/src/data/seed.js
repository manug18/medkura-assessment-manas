export const doctors = [
  {
    id: "doc_001",
    name: "Dr. Priya Nair",
    specialty: "cardiology",
    city: "hyderabad",
    consultationFee: 800,
    isVerified: true,
    averageRating: 4.7,
  },
  {
    id: "doc_002",
    name: "Dr. Amit Shah",
    specialty: "orthopedic",
    city: "bangalore",
    consultationFee: 1000,
    isVerified: true,
    averageRating: 4.5,
  },
  {
    id: "doc_003",
    name: "Dr. Meera Reddy",
    specialty: "cardiology",
    city: "hyderabad",
    consultationFee: 1200,
    isVerified: true,
    averageRating: 4.9,
  },
  {
    id: "doc_004",
    name: "Dr. Rajesh Kumar",
    specialty: "dermatology",
    city: "mumbai",
    consultationFee: 900,
    isVerified: true,
    averageRating: 4.6,
  },
  {
    id: "doc_005",
    name: "Dr. Anjali Desai",
    specialty: "pediatrics",
    city: "pune",
    consultationFee: 700,
    isVerified: true,
    averageRating: 4.8,
  },
  {
    id: "doc_006",
    name: "Dr. Vikram Singh",
    specialty: "orthopedic",
    city: "delhi",
    consultationFee: 1100,
    isVerified: false,
    averageRating: 4.3,
  },
];

// Helper function to generate slots for next 7 days
function generateSlots(doctorId, startHour = 10, endHour = 17, duration = 30) {
  const slots = [];
  const today = new Date();
  
  // Generate slots for next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    // Generate slots for each hour
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const slotDate = new Date(date);
        slotDate.setHours(hour, minute, 0, 0);
        
        // Random booking status (20% chance of being booked)
        const isBooked = Math.random() < 0.2;
        
        slots.push({
          datetime: slotDate.toISOString(),
          duration,
          isBooked,
        });
      }
    }
  }
  
  return slots;
}

// Generate slots for all doctors
export const slots = {
  doc_001: generateSlots('doc_001', 9, 17, 30),
  doc_002: generateSlots('doc_002', 10, 18, 60),
  doc_003: generateSlots('doc_003', 9, 16, 30),
  doc_004: generateSlots('doc_004', 11, 19, 30),
  doc_005: generateSlots('doc_005', 10, 17, 30),
  doc_006: generateSlots('doc_006', 10, 16, 60),
};

export const bookings = [];