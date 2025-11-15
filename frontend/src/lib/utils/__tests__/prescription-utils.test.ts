import { 
  formatMedicationInstructions,
  calculateRemainingDays,
  canRequestRefill,
  formatPrescriptionDate,
  getPrimaryMedications,
  calculateTotalQuantity,
  generateMedicationReminders,
  formatReminderTime,
  isReminderDueSoon,
  groupRemindersByDay,
  getNotificationSettings,
  scheduleFollowUpReminders,
  isWithinQuietHours,
  isReminderInQuietHours,
  calculateNotificationTime,
  createNotificationSchedule,
  formatNotificationMessage,
  getCurrentDate,
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationType
} from '../prescription-utils';
import { format, addDays, parseISO } from 'date-fns';

// Mock implementation to control current date for tests
const mockCurrentDate = new Date('2025-08-15T12:00:00Z');
jest.mock('../prescription-utils', () => {
  const original = jest.requireActual('../prescription-utils');
  return {
    ...original,
    getCurrentDate: jest.fn().mockImplementation(() => mockCurrentDate)
  };
});

// Test medication and prescription objects
const mockMedication = {
  id: 'med-123',
  name: 'TestMed',
  dosage: '10mg',
  frequency: 'twice daily',
  quantity: 30,
  refills: 2,
  duration: '30 days'
};

const mockPrescription = {
  id: 'rx-123',
  status: 'ACTIVE',
  issueDate: '2025-07-15T00:00:00Z',
  expiryDate: '2025-09-15T00:00:00Z',
  doctorName: 'Dr. Test',
  medications: [mockMedication],
  refills: 2
};

describe('Prescription Utilities', () => {
  describe('formatMedicationInstructions', () => {
    test('formats complete medication instructions correctly', () => {
      const result = formatMedicationInstructions(mockMedication);
      expect(result).toBe('10mg, twice daily for 30 days');
    });

    test('handles missing frequency and duration', () => {
      const medication = { ...mockMedication, frequency: undefined, duration: undefined };
      const result = formatMedicationInstructions(medication);
      expect(result).toBe('10mg');
    });
  });

  describe('calculateRemainingDays', () => {
    test('calculates remaining days correctly for active prescription', () => {
      const days = calculateRemainingDays(mockPrescription);
      // mockCurrentDate is 2025-08-15, expiryDate is 2025-09-15, should be 31 days
      expect(days).toBe(31);
    });

    test('returns 0 for non-active prescriptions', () => {
      const expiredPrescription = { ...mockPrescription, status: 'EXPIRED' };
      expect(calculateRemainingDays(expiredPrescription)).toBe(0);
    });

    test('returns 0 for missing expiry date', () => {
      const noExpiryPrescription = { ...mockPrescription, expiryDate: undefined };
      expect(calculateRemainingDays(noExpiryPrescription)).toBe(0);
    });
  });

  describe('canRequestRefill', () => {
    test('allows refill for active prescriptions with refills', () => {
      expect(canRequestRefill(mockPrescription)).toBe(true);
    });

    test('disallows refill for non-active prescriptions', () => {
      const expiredPrescription = { ...mockPrescription, status: 'EXPIRED' };
      expect(canRequestRefill(expiredPrescription)).toBe(false);
    });

    test('disallows refill when no refills left', () => {
      const noRefillsPrescription = { ...mockPrescription, refills: 0 };
      expect(canRequestRefill(noRefillsPrescription)).toBe(false);
    });
  });

  describe('generateMedicationReminders', () => {
    test('generates correct reminders for twice daily medication', () => {
      const startDate = new Date('2025-08-15T00:00:00Z');
      const reminders = generateMedicationReminders(mockMedication, startDate, 1);
      
      // Should create 2 reminders for "twice daily" on the same day
      expect(reminders.length).toBe(2);
      expect(reminders[0].time.getHours()).toBe(9);
      expect(reminders[1].time.getHours()).toBe(21);
    });
  });

  describe('scheduleFollowUpReminders', () => {
    test('creates follow-up reminders based on refills', () => {
      const startDate = new Date('2025-08-15T12:00:00Z');
      const reminders = scheduleFollowUpReminders(mockMedication, startDate);
      
      // Should create 2 reminders for 2 refills
      expect(reminders.length).toBe(2);
      
      // First reminder should be at start date + followUpReminderMinutes (30 by default)
      const expectedFirstTime = new Date('2025-08-15T12:30:00Z');
      expect(reminders[0].time.getTime()).toBe(expectedFirstTime.getTime());
      
      // Second reminder should be 30 minutes after the first
      const expectedSecondTime = new Date('2025-08-15T13:00:00Z');
      expect(reminders[1].time.getTime()).toBe(expectedSecondTime.getTime());
    });

    test('handles null followUpReminderMinutes', () => {
      const customPreferences = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        followUpReminderMinutes: null
      };
      
      const reminders = scheduleFollowUpReminders(mockMedication, undefined, customPreferences);
      expect(reminders.length).toBe(0);
    });
  });

  describe('isWithinQuietHours', () => {
    test('identifies time within quiet hours correctly', () => {
      // Set up a time at 11 PM which should be in quiet hours
      const timeInQuietHours = new Date('2025-08-15T23:00:00Z');
      
      const result = isWithinQuietHours(timeInQuietHours, DEFAULT_NOTIFICATION_SETTINGS);
      expect(result).toBe(true);
    });

    test('identifies time outside quiet hours correctly', () => {
      // Set up a time at 10 AM which should be outside quiet hours
      const timeOutsideQuietHours = new Date('2025-08-15T10:00:00Z');
      
      const result = isWithinQuietHours(timeOutsideQuietHours, DEFAULT_NOTIFICATION_SETTINGS);
      expect(result).toBe(false);
    });

    test('handles weekend quiet hours correctly', () => {
      // Set up a weekend date (Sunday)
      const weekendTime = new Date('2025-08-17T12:00:00Z'); // Sunday
      
      // With weekend quiet hours disabled
      const resultDisabled = isWithinQuietHours(weekendTime, DEFAULT_NOTIFICATION_SETTINGS);
      expect(resultDisabled).toBe(false);
      
      // With weekend quiet hours enabled
      const customPreferences = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        enableWeekendQuietHours: true
      };
      
      const resultEnabled = isWithinQuietHours(weekendTime, customPreferences);
      expect(resultEnabled).toBe(true);
    });
  });

  describe('formatNotificationMessage', () => {
    test('formats overdue medication reminder correctly', () => {
      const pastTime = new Date('2025-08-15T11:00:00Z'); // Earlier than mockCurrentDate
      const message = formatNotificationMessage(mockMedication, pastTime);
      expect(message).toBe("Medication reminder: It's time to take 10mg of TestMed");
    });

    test('formats future medication reminder correctly', () => {
      const futureTime = new Date('2025-08-15T14:00:00Z'); // Later than mockCurrentDate
      const message = formatNotificationMessage(mockMedication, futureTime);
      expect(message).toContain("Medication reminder: Take 10mg of TestMed at");
    });
  });
});
