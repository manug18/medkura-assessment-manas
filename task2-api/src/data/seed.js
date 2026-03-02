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
];

export const slots = {
  doc_001: [
    {
      datetime: "2026-03-01T10:00:00+05:30",
      duration: 30,
      isBooked: false,
    },
    {
      datetime: "2026-03-01T11:00:00+05:30",
      duration: 30,
      isBooked: true,
    },
  ],
};

export const bookings = [];