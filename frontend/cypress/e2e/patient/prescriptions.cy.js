// cypress/e2e/patient/prescriptions.cy.js

describe('Patient Prescriptions Module', () => {
  beforeEach(() => {
    // Login as a patient before each test
    cy.login('patient@example.com', 'password123');
  });

  it('should display prescriptions list', () => {
    // Visit the prescriptions page
    cy.visit('/dashboard/prescriptions');
    
    // Check if page loads correctly
    cy.get('h1').should('contain', 'My Prescriptions');
    
    // Check if prescriptions are loaded
    cy.get('[data-testid="prescription-card"]').should('have.length.at.least', 1);
  });

  it('should filter prescriptions by status', () => {
    cy.visit('/dashboard/prescriptions');
    
    // Select Active status
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-value="ACTIVE"]').click();
    
    // Check if only active prescriptions are displayed
    cy.get('[data-testid="prescription-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="prescription-status"]').should('contain', 'Active');
    });
  });

  it('should search prescriptions', () => {
    cy.visit('/dashboard/prescriptions');
    
    // Search for a specific medication name
    cy.get('[data-testid="search-input"]').type('Amoxicillin');
    
    // Check if search results are correct
    cy.get('[data-testid="prescription-card"]').should('have.length.at.least', 1);
    cy.get('[data-testid="prescription-card"]').first().should('contain', 'Amoxicillin');
  });

  it('should display prescription details', () => {
    // First get a prescription ID from the list
    cy.visit('/dashboard/prescriptions');
    cy.get('[data-testid="prescription-card"]').first().click();
    
    // Check if details page loads correctly
    cy.get('h1').should('contain', 'Prescription Details');
    
    // Check if medication details are displayed
    cy.get('[data-testid="medication-item"]').should('have.length.at.least', 1);
  });

  it('should download prescription PDF', () => {
    cy.visit('/dashboard/prescriptions');
    cy.get('[data-testid="prescription-card"]').first().click();
    
    // Mock the download functionality since Cypress can't test actual downloads
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    
    cy.get('[data-testid="download-pdf"]').click();
    
    // Check if download was initiated
    cy.get('@windowOpen').should('be.called');
  });

  it('should request prescription refill', () => {
    // Visit an active prescription with available refills
    cy.visit('/dashboard/prescriptions');
    cy.get('[data-testid="active-prescription"]').first().click();
    
    // Check if refill button exists and click it
    cy.get('[data-testid="request-refill"]').click();
    
    // Fill in refill form
    cy.get('[data-testid="refill-form"]').within(() => {
      cy.get('#reason').type('Running low on medication');
      cy.get('#pickup').click();
      cy.get('#pharmacy').select('pharm1');
      cy.get('[type="submit"]').click();
    });
    
    // Check if success message is displayed
    cy.get('[data-testid="refill-success"]').should('be.visible');
  });

  it('should view medication reminders', () => {
    cy.visit('/dashboard/medication-reminders');
    
    // Check if page loads correctly
    cy.get('h1').should('contain', 'Medication Reminders');
    
    // Check if reminder cards are displayed
    cy.get('[data-testid="reminder-card"]').should('have.length.at.least', 1);
  });
});
