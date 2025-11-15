// cypress/e2e/patient/medication-reminders.cy.js

describe('Patient Medication Reminders Module', () => {
  beforeEach(() => {
    // Login as a patient before each test
    cy.login('patient@example.com', 'password123');
  });

  it('should display medication reminders on the dashboard', () => {
    // Visit the dashboard
    cy.visit('/dashboard');
    
    // Check if medication reminders widget exists
    cy.get('[data-testid="medication-reminders-widget"]').should('exist');
    
    // Check if reminders are displayed
    cy.get('[data-testid="medication-reminder-item"]').should('have.length.at.least', 1);
  });

  it('should navigate to detailed medication reminders page', () => {
    // Visit the dashboard
    cy.visit('/dashboard');
    
    // Click on "View All Reminders" button
    cy.get('[data-testid="view-all-reminders"]').click();
    
    // Verify we're on the medication reminders page
    cy.url().should('include', '/dashboard/medication-reminders');
    cy.get('h1').should('contain', 'Medication Reminders');
  });

  it('should display reminders grouped by day', () => {
    // Visit the medication reminders page
    cy.visit('/dashboard/medication-reminders');
    
    // Check if day groupings exist
    cy.get('[data-testid="reminder-day-group"]').should('have.length.at.least', 1);
    
    // Check that each day group has a date heading
    cy.get('[data-testid="reminder-day-group"]').first().find('h3').should('exist');
  });

  it('should mark a reminder as taken', () => {
    // Visit the medication reminders page
    cy.visit('/dashboard/medication-reminders');
    
    // Find a reminder that's not marked as taken
    cy.get('[data-testid="reminder-take-button"]').first().click();
    
    // Verify it's marked as taken
    cy.get('[data-testid="reminder-status"]').first().should('contain', 'Taken');
  });

  it('should filter reminders by date', () => {
    // Visit the medication reminders page
    cy.visit('/dashboard/medication-reminders');
    
    // Open date picker
    cy.get('[data-testid="date-picker"]').click();
    
    // Select a specific date (tomorrow)
    cy.get('[data-testid="calendar"]').find('[data-day="tomorrow"]').click();
    
    // Verify reminders for that date are shown
    cy.get('[data-testid="reminder-day-group"]').should('have.length', 1);
  });
  
  it('should navigate to notification settings page', () => {
    // Visit the medication reminders page
    cy.visit('/dashboard/medication-reminders');
    
    // Click on notification settings button
    cy.get('[data-testid="notification-settings"]').click();
    
    // Verify we're on the notification settings page
    cy.url().should('include', '/dashboard/notification-settings');
    cy.get('h1').should('contain', 'Notification Settings');
  });
  
  it('should save notification preferences', () => {
    // Visit the notification settings page
    cy.visit('/dashboard/notification-settings');
    
    // Toggle email notifications on
    cy.get('#email-notifications').click({ force: true });
    
    // Change notification time
    cy.get('#notify-before').invoke('val', 30).trigger('change');
    
    // Save preferences
    cy.contains('button', 'Save Preferences').click();
    
    // Reload the page to verify persistence
    cy.reload();
    
    // Verify the email notifications toggle is still on
    cy.get('#email-notifications').should('be.checked');
  });
});
