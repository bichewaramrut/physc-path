"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  nextAvailable: string;
  consultationFee: number;
  availability: 'Available' | 'Unavailable';
  location: string;
  address: string;
}

interface ServiceOption {
  name: string;
  price: number;
  selected?: boolean;
}

export default function BookAppointment({ params }: { params: { doctorId: string } }) {
  const router = useRouter();
  const { doctorId } = params;
  
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  
  useEffect(() => {
    // Mock data for doctor
    const mockDoctor: Doctor = {
      id: doctorId,
      name: 'Dr. Sarah Johnson',
      specialty: 'Clinical Psychologist',
      image: '/images/doctors/doctor-1.jpg',
      rating: 4.8,
      reviewCount: 124,
      nextAvailable: '23 Mar 2025',
      consultationFee: 1150,
      availability: 'Available',
      location: 'Bengaluru, Karnataka',
      address: '5th Street, 1011 W 5th St, Suite 120, Austin, TX 78703'
    };
    
    // Mock services
    const mockServices: ServiceOption[] = [
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 },
      { name: 'Echocardiograms', price: 310 }
    ];
    
    setDoctor(mockDoctor);
    setSelectedServices(mockServices);
    setLoading(false);
  }, [doctorId]);
  
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<'Video Call' | 'Audio Call' | 'Chat' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    symptoms: '',
    file: null as File | null,
    reason: ''
  });
  
  const handleServiceSelect = (index: number) => {
    const services = [...selectedServices];
    services[index].selected = !services[index].selected;
    setSelectedServices(services);
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleAppointmentTypeSelect = (type: 'Video Call' | 'Audio Call' | 'Chat') => {
    setSelectedAppointmentType(type);
  };

  // May 2025 calendar data
  const calendarDays = [
    { day: 1, available: true }, { day: 2, available: true }, { day: 3, available: true },
    { day: 4, available: false }, { day: 5, available: true }, { day: 6, available: true }, 
    { day: 7, available: true }, { day: 8, available: true }, { day: 9, available: true },
    { day: 10, available: true }, { day: 11, available: true }, { day: 12, available: true },
    { day: 13, available: true }, { day: 14, available: true }, { day: 15, available: true },
    { day: 16, available: true }, { day: 17, available: true }, { day: 18, available: true },
    { day: 19, available: true }, { day: 20, available: true }, { day: 21, available: true },
    { day: 22, available: true }, { day: 23, available: true }, { day: 24, available: true },
    { day: 25, available: true }, { day: 26, available: true }, { day: 27, available: true },
    { day: 28, available: true }, { day: 29, available: true }, { day: 30, available: true },
    { day: 31, available: true }
  ];
  
  const morningSlots = [
    { time: '09:00 - 10:00', available: true },
    { time: '10:00 - 11:00', available: true },
    { time: '11:00 - 12:00', available: false }
  ];
  
  const afternoonSlots = [
    { time: '12:00 - 13:00', available: true },
    { time: '13:00 - 14:00', available: true },
    { time: '14:00 - 15:00', available: true }
  ];
  
  const eveningSlots = [
    { time: '16:00 - 17:00', available: true },
    { time: '17:00 - 18:00', available: true },
    { time: '18:00 - 19:00', available: true }
  ];

  const handleSubmit = () => {
    // Process payment and book appointment
    setStep(step + 1);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 rounded-lg text-red-800 dark:text-red-300">
        {error}
      </div>
    );
  }
  
  if (!doctor) {
    return <div className="text-center py-12">Doctor not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center w-full max-w-3xl">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex-1 relative">
              <div className={`flex flex-col items-center ${step === stepNumber ? 'text-orange-500' : step > stepNumber ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === stepNumber ? 'bg-orange-100 border border-orange-500' : step > stepNumber ? 'bg-green-100 border border-green-500' : 'bg-gray-100 border border-gray-300'}`}>
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <div className="text-xs mt-1">
                  {stepNumber === 1 && "Services"}
                  {stepNumber === 2 && "Appointment Type"}
                  {stepNumber === 3 && "Time & Date"}
                  {stepNumber === 4 && "Basic Information"}
                  {stepNumber === 5 && "Confirmation"}
                </div>
              </div>
              {stepNumber < 5 && (
                <div className={`absolute top-4 w-full h-0.5 ${step > stepNumber ? 'bg-green-500' : 'bg-gray-300'}`} style={{ left: '50%', zIndex: -1 }} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Doctor Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center">
        <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="font-bold text-lg">{doctor.name}</h2>
            <div className="ml-2 px-2 py-0.5 bg-yellow-100 rounded-sm flex items-center">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-xs font-semibold">{doctor.rating}</span>
            </div>
          </div>
          <p className="text-sm text-orange-500">{doctor.specialty}</p>
          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{doctor.address}</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedServices.map((service, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer ${service.selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                onClick={() => handleServiceSelect(index)}
              >
                <div className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <span className="font-semibold">₹{service.price}</span>
                </div>
                {service.selected && (
                  <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Appointment Type */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Select Your Appointment Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${selectedAppointmentType === 'Video Call' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleAppointmentTypeSelect('Video Call')}
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <span className="mt-2">Video Call</span>
            </div>
            
            <div
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${selectedAppointmentType === 'Audio Call' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleAppointmentTypeSelect('Audio Call')}
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="mt-2">Audio Call</span>
            </div>
            
            <div
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${selectedAppointmentType === 'Chat' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => handleAppointmentTypeSelect('Chat')}
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="mt-2">Chat</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!selectedAppointmentType}
            >
              Select Date & Time
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Date and Time Selection */}
      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Booking Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <ul className="list-disc pl-5">
                  <li>Echocardiograms</li>
                  <li>Cardiology</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Appointment Type</p>
                <p>{selectedAppointmentType}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <button className="text-blue-600">&lt;</button>
                <h4 className="font-semibold">May 2025</h4>
                <button className="text-blue-600">&gt;</button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                <div className="text-xs font-medium text-gray-500">Su</div>
                <div className="text-xs font-medium text-gray-500">Mo</div>
                <div className="text-xs font-medium text-gray-500">Tu</div>
                <div className="text-xs font-medium text-gray-500">We</div>
                <div className="text-xs font-medium text-gray-500">Th</div>
                <div className="text-xs font-medium text-gray-500">Fr</div>
                <div className="text-xs font-medium text-gray-500">Sa</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before May 1st */}
                {[...Array(3)].map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                ))}
                
                {calendarDays.map((day) => (
                  <div 
                    key={day.day}
                    onClick={() => day.available && setSelectedDate(`${day.day} May 2025`)}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-sm
                      ${day.available ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                      ${selectedDate === `${day.day} May 2025` ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Available Time Slots</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Morning</p>
                  <div className="grid grid-cols-2 gap-2">
                    {morningSlots.map((slot, index) => (
                      <div 
                        key={`morning-${index}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        className={`
                          py-2 px-4 border rounded-lg text-center text-sm
                          ${slot.available ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                          ${selectedTime === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-600'}
                        `}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Afternoon</p>
                  <div className="grid grid-cols-2 gap-2">
                    {afternoonSlots.map((slot, index) => (
                      <div 
                        key={`afternoon-${index}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        className={`
                          py-2 px-4 border rounded-lg text-center text-sm
                          ${slot.available ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                          ${selectedTime === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-600'}
                        `}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Evening</p>
                  <div className="grid grid-cols-2 gap-2">
                    {eveningSlots.map((slot, index) => (
                      <div 
                        key={`evening-${index}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        className={`
                          py-2 px-4 border rounded-lg text-center text-sm
                          ${slot.available ? 'cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                          ${selectedTime === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-600'}
                        `}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime}
            >
              Add Basic Information
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 4: Patient Information */}
      {step === 4 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Booking Info</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <ul className="list-disc pl-5">
                  <li>Echocardiograms</li>
                  <li>Cardiology</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Appointment Type</p>
                <p>{selectedAppointmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                <p>{selectedDate}, {selectedTime}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                id="firstName"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.firstName}
                onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.lastName}
                onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.phone}
                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="selectPatient" className="block text-sm font-medium">Select Patient</label>
              <select
                id="selectPatient"
                className="w-full p-2 border rounded-lg"
              >
                <option value="self">Myself</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="symptoms" className="block text-sm font-medium">Symptoms</label>
              <textarea
                id="symptoms"
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={patientInfo.symptoms}
                onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="file" className="block text-sm font-medium">Attachment</label>
              <div className="border border-dashed rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose file</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No file chosen</p>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium">Reason for visit</label>
              <textarea
                id="reason"
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={patientInfo.reason}
                onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!patientInfo.firstName || !patientInfo.lastName || !patientInfo.email}
            >
              Select Payment
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 5: Payment */}
      {step === 5 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Payment Gateway</h3>
              
              <div>
                <p className="text-sm mb-2">Credit/Debit Cards</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Pay with your Credit / Debit Card</p>
                
                <div className="flex justify-end mb-4">
                  <div className="flex space-x-2">
                    <div className="h-6 w-10 bg-red-500 rounded"></div>
                    <div className="h-6 w-10 bg-blue-500 rounded"></div>
                    <div className="h-6 w-10 bg-blue-700 rounded"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="block text-sm">Card number</label>
                    <div className="flex border rounded-lg overflow-hidden">
                      <input
                        type="text"
                        id="cardNumber"
                        className="flex-1 p-2 bg-transparent"
                        placeholder="0000 0000 0000 0000"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="expiry" className="block text-sm">MM / YY</label>
                      <div className="flex border rounded-lg overflow-hidden">
                        <input
                          type="text"
                          id="expiry"
                          className="flex-1 p-2 bg-transparent"
                          placeholder="MM / YY"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="cvv" className="block text-sm">CVV</label>
                      <div className="flex border rounded-lg overflow-hidden">
                        <input
                          type="text"
                          id="cvv"
                          className="flex-1 p-2 bg-transparent"
                          placeholder="123"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                            <path d="M21.17 8H12V2.83c4 1.18 7 4.3 7.17 5.17z"/>
                            <path d="M3.77 7.77 2 6l1.77-1.77L6 2l1.77 1.77L12 8 7.77 3.77z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Booking Info</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                  <div className="flex justify-between mt-1">
                    <p>Echocardiograms</p>
                    <p className="font-semibold">₹310</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p>Cardiology</p>
                    <p className="font-semibold">₹310</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Appointment Type</p>
                  <p className="mt-1">Video Call</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                  <p className="mt-1">10:00 - 11:00 AM, 15, Oct</p>
                </div>
                
                <hr className="my-4" />
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Info</p>
                  <div className="flex justify-between mt-1">
                    <p>Echocardiograms</p>
                    <p className="font-semibold">₹310</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p>Cardiology</p>
                    <p className="font-semibold">₹310</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p>Tax</p>
                    <p className="font-semibold">₹20</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-red-500">Discount</p>
                    <p className="font-semibold text-red-500">-₹50</p>
                  </div>
                  
                  <div className="flex justify-between mt-4 py-2 border-t">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold text-blue-600">₹620</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 6: Confirmation */}
      {step === 6 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2">Booking Confirmed</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Your booking has been confirmed with Dr. Michael Brown be on time before 15 mins From the appointment Time
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Booking Number</span>
              <span className="font-semibold text-blue-600">53428738</span>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="h-32 w-32 bg-white dark:bg-gray-800 p-2">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <path fill="currentColor" d="M0 0h100v100H0z" />
                </svg>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Scan this QR Code to download the details of Appointment
            </p>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <h4 className="font-semibold mb-2">Booking Info</h4>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <ul className="list-disc pl-5">
                  <li>Echocardiograms</li>
                  <li>Cardiology</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                <p>10:00 - 11:00 AM, 15, Oct</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Appointment Type</p>
                <p>Video Call</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <h4 className="font-semibold mb-2">Need Our Assistance</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Call us in case you face any Issue on Booking / Cancellation
            </p>
            
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Us
              </Button>
              <Button onClick={() => router.push('/dashboard/appointments')}>
                Start New Booking
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Add To Calendar
            </Button>
          </div>
          
          <Button 
            variant="ghost"
            onClick={() => router.push('/dashboard/appointments')}
          >
            Back to bookings
          </Button>
        </div>
      )}
    </div>
  );
}
