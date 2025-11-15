# Video Consultation Test Flow - Provider & Patient Journey

---

## 🎥 **2-HOUR EXTENDED VIDEO CONSULTATION TEST FLOW**

### **Extended Session Overview**
```
Session Duration: 2 hours (120 minutes)
Session Type: Extended Psychiatric/Therapy Consultation
Test Scenario: Initial Assessment + Therapy Session
Expected Features: All video call features + session recording + extended file sharing
```

### **Pre-Session Setup (15 minutes before)**

#### **Provider Pre-Session Checklist**
```
Time: 15 minutes before session
URL: http://localhost:3000/dashboard/consultations

Provider Actions:
1. Review extended session patient history
2. Prepare session agenda and therapy materials
3. Test all video call features:
   - Camera quality (HD 720p for 2-hour session)
   - Audio clarity and noise cancellation
   - Screen sharing functionality
   - File upload/download capabilities
   - Recording permissions and setup
4. Ensure stable internet (>2 Mbps for extended session)
5. Prepare backup communication method
6. Set "Do Not Disturb" for 2.5 hours
7. Check lighting and camera positioning
8. Test breakout options for brief breaks

Session Configuration:
- Duration: 120 minutes
- Recording: Enabled (with patient consent)
- Chat: Enabled throughout session
- File Sharing: Unlimited during session
- Screen Sharing: Provider enabled
- Break intervals: Every 30 minutes (optional)
```

#### **Patient Pre-Session Checklist**
```
Time: 15 minutes before session
URL: http://localhost:3000/dashboard/consultations

Patient Actions:
1. Find private, comfortable space for 2-hour session
2. Test camera and microphone
3. Ensure stable internet connection
4. Prepare session materials:
   - Medical documents
   - Previous therapy notes
   - Questions list
   - Medications list
   - Support person contact (if needed)
5. Set phone to silent/do not disturb
6. Prepare water and comfortable seating
7. Test file upload for sharing documents
8. Confirm recording consent

Session Preparation:
- Environment: Private, well-lit, minimal distractions
- Materials: Notebook, pen, water, tissues
- Support: Emergency contact available
- Technology: Backup device ready
- Comfort: Comfortable chair, room temperature
```

---

### **2-Hour Session Timeline & Test Points**

#### **Session Start (0-5 minutes)**
```
Provider Flow:
1. Join meeting room 5 minutes early
   URL: http://localhost:3000/meeting/extended-session-{sessionId}
2. Initialize recording with patient consent
3. Test all features one final time
4. Welcome patient and verify identity
5. Review session agenda and duration
6. Confirm patient comfort and readiness

Patient Flow:
1. Join meeting room on time
2. Confirm camera/audio working
3. Provide consent for recording
4. Confirm private environment
5. Review session expectations
6. Ask any technical questions

Test Validation Points:
✅ Both users successfully connected
✅ Audio/video quality optimal
✅ Recording started with consent
✅ Chat functionality working
✅ File sharing capability confirmed
✅ No connection issues or delays
```

#### **First Session Block (5-35 minutes) - Initial Assessment**
```
Provider Actions:
1. Conduct comprehensive intake assessment
2. Document notes in real-time using chat or screen annotation
3. Share assessment forms via file upload
4. Use screen sharing for educational materials
5. Monitor patient comfort and engagement
6. Test mid-session file upload capabilities

Patient Actions:
1. Complete verbal assessment questions
2. Upload requested documents (medical history, previous assessments)
3. Share screen if requested (mobile apps, health data)
4. Participate in initial evaluation exercises
5. Ask clarification questions via chat
6. Provide feedback on session quality

Technical Test Points:
✅ Sustained HD video quality (30 minutes)
✅ Clear audio without lag or echo
✅ Chat messages sent/received instantly
✅ File uploads successful (multiple files)
✅ Screen sharing smooth and clear
✅ No connection drops or quality degradation
✅ Recording capture quality maintained
```

#### **First Break (35-40 minutes) - Optional 5-minute break**
```
Break Protocol:
1. Provider announces break
2. Camera can be turned off (optional)
3. Audio muted during break
4. Chat remains active for urgent needs
5. Recording continues or pauses (provider choice)
6. Return time communicated clearly

Technical Tests During Break:
✅ Connection maintained during break
✅ Ability to resume seamlessly
✅ Chat functionality during break
✅ Recording pause/resume works
✅ Video/audio quality maintained after break
```

#### **Second Session Block (40-70 minutes) - Therapy Session**
```
Provider Actions:
1. Resume session with therapy techniques
2. Use screen sharing for therapy worksheets
3. Conduct interactive exercises via video
4. Share educational resources through file upload
5. Monitor patient emotional state visually
6. Document therapy progress in real-time
7. Test advanced features (drawing/annotation if available)

Patient Actions:
1. Engage in therapy exercises and discussions
2. Share requested information or documents
3. Participate in visual therapy techniques
4. Upload completed worksheets or drawings
5. Use chat for private notes or questions
6. Practice coping techniques on camera

Extended Technical Tests:
✅ Video call stability over 60+ minutes
✅ Multiple file exchanges (10+ files)
✅ Screen sharing for extended periods (15+ minutes)
✅ Chat history preserved throughout session
✅ Recording quality consistent
✅ No memory leaks or performance degradation
✅ Bandwidth adaptation for longer session
```

#### **Second Break (70-75 minutes) - Mid-session break**
```
Mid-Session Break Protocol:
1. Assess patient energy and comfort
2. Optional 5-minute break
3. Check technical performance
4. Refresh connection if needed
5. Prepare for final session block

Technical Health Check:
✅ System performance check
✅ Memory usage within limits
✅ Connection stability assessment
✅ Audio/video sync verification
✅ Recording file size monitoring
```

#### **Final Session Block (75-115 minutes) - Conclusion & Planning**
```
Provider Actions:
1. Summarize session findings
2. Develop treatment plan collaboratively
3. Share follow-up resources via file upload
4. Schedule next appointments
5. Review homework assignments
6. Provide crisis contact information
7. Test prescription writing (if applicable)
8. Prepare session summary document

Patient Actions:
1. Review session summary with provider
2. Ask final questions and clarifications
3. Download treatment plan and resources
4. Confirm understanding of next steps
5. Save important documents from session
6. Provide session feedback
7. Schedule follow-up appointments

Final Technical Validation:
✅ 2-hour connection stability achieved
✅ All files successfully shared and downloaded
✅ Complete chat transcript available
✅ Recording captured entire session
✅ Session summary generated
✅ All uploaded files accessible
✅ No data loss throughout 2-hour session
```

#### **Session Wrap-up (115-120 minutes)**
```
Closing Protocol:
1. Final summary and next steps review
2. Ensure all files downloaded by patient
3. Confirm follow-up appointment details
4. Stop recording with final consent confirmation
5. Exchange contact information for emergencies
6. End video call gracefully
7. Generate and send session summary email

Post-Session Technical Tasks:
✅ Recording saved successfully
✅ Chat transcript generated
✅ All files organized in session folder
✅ Session summary email sent
✅ Technical performance report generated
✅ Connection logs saved for analysis
```

---

### **Extended Session Technical Requirements**

#### **Bandwidth & Performance for 2-Hour Sessions**
```
Minimum Requirements:
- Internet Speed: 2+ Mbps sustained
- RAM: 4GB+ available
- CPU: Modern processor (2015+)
- Storage: 2GB+ free space for recordings
- Browser: Latest Chrome, Firefox, or Safari

Optimal Requirements:
- Internet Speed: 5+ Mbps sustained  
- RAM: 8GB+ available
- CPU: Multi-core processor
- Storage: 10GB+ free space
- Browser: Latest version with hardware acceleration

Performance Monitoring:
✅ CPU usage stays below 70% throughout session
✅ Memory usage doesn't exceed 2GB
✅ Network usage remains stable
✅ No browser crashes or freezes
✅ Recording file size manageable (<5GB)
✅ Audio/video sync maintained
```

#### **Extended Session File Management**
```
Session Folder Structure:
/{patientPhone}_{date}_{sessionDuration}/
Example: /15550456_20250817_120min_extended/

Files Generated:
- recording_full_session.mp4 (2-hour video)
- chat_transcript_complete.txt (all chat messages)
- uploaded_documents/ (all patient uploads)
- shared_resources/ (provider shared materials)
- session_summary.pdf (comprehensive summary)
- therapy_worksheets/ (completed exercises)
- assessment_forms/ (intake and evaluation)
- technical_logs/ (performance and connection data)

File Size Estimates:
- 2-hour recording: 3-8GB (depending on quality)
- Chat transcript: 10-50KB
- Document uploads: Variable (patient dependent)
- Session folder total: 4-10GB typical
```

---

### **Emergency Protocols for Extended Sessions**

#### **Technical Issues During 2-Hour Session**
```
Connection Drop Protocol:
1. Immediate reconnection attempt
2. Switch to backup device if needed
3. Use phone/mobile data as backup internet
4. Continue session via audio-only if video fails
5. Resume recording when reconnected
6. Document technical interruption in notes

Provider Backup Plan:
- Secondary device ready with same meeting room
- Phone number for audio backup
- Ability to send session materials via email
- Alternative meeting room URL prepared
- Technical support contact available

Patient Backup Plan:
- Secondary device (phone/tablet) ready
- Provider's direct phone number
- Alternative internet connection (mobile hotspot)
- Ability to receive session materials via email
- Emergency contact number provided to provider
```

#### **Medical Emergency Protocol**
```
Emergency Response:
1. Provider assessment of patient condition
2. Immediate connection to emergency services if needed
3. Provider stays connected until help arrives
4. Emergency contact notification
5. Session recording preserved for medical records
6. Follow-up within 24 hours

Technical Support:
- Emergency session recording preservation
- Immediate access to session chat/files
- Priority technical support for emergency sessions
- Secure transmission of emergency session data
```

---

### **Post-Session Validation & Analytics**

#### **2-Hour Session Quality Metrics**
```
Connection Quality:
✅ Total connection time: 120 minutes
✅ Disconnection incidents: 0-1 acceptable
✅ Audio quality rating: 4.5/5 average
✅ Video quality rating: 4.5/5 average
✅ File transfer success rate: 100%
✅ Chat message delivery: 100%

Technical Performance:
✅ Average CPU usage: <70%
✅ Peak memory usage: <3GB
✅ Network stability: >95% uptime
✅ Recording quality: HD maintained
✅ File upload speed: <30 seconds per file
✅ Screen sharing lag: <500ms

User Experience:
✅ Provider satisfaction: 4.5/5
✅ Patient satisfaction: 4.5/5
✅ Session objectives achieved: 95%+
✅ Technical issues resolved: <5 minutes total
✅ Ease of use rating: 4.5/5
✅ Would recommend platform: Yes
```

#### **Session Data Analytics**
```
Engagement Metrics:
- Active speaking time: Provider vs Patient ratio
- Chat message count and frequency
- File sharing interactions count
- Screen sharing duration and frequency
- Break patterns and duration
- Attention/engagement indicators

Technical Analytics:
- Bandwidth usage patterns over 2 hours
- Quality adaptation events
- Device performance trends
- Browser compatibility scores
- Feature utilization rates
- Error recovery success rates

Clinical Outcomes:
- Session objectives completion rate
- Patient comfort and satisfaction
- Provider efficiency metrics
- Treatment plan development success
- Follow-up scheduling completion
- Resource sharing effectiveness
```

---

### **Quick 2-Hour Session Test Commands**

#### **Extended Session Setup Commands**
```powershell
# Create 2-hour extended session
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/create-extended" -Method POST -Body '{"duration": 120, "type": "therapy", "recordingEnabled": true, "participantLimit": 2}' -ContentType "application/json"

# Join extended session as provider
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/extended-session-001/join" -Method POST -Body '{"participantId": "provider_dr_smith", "participantName": "Dr. John Smith", "role": "provider", "sessionDuration": 120}' -ContentType "application/json"

# Join extended session as patient  
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/extended-session-001/join" -Method POST -Body '{"participantId": "patient_sarah", "participantName": "Sarah Johnson", "role": "patient", "sessionDuration": 120}' -ContentType "application/json"

# Monitor session performance
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/extended-session-001/performance" -Method GET

# Get session recording status
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/extended-session-001/recording/status" -Method GET

# Download session files
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/extended-session-001/files" -Method GET
```

#### **Extended Session URLs**
```
Provider Extended Portal: http://localhost:3000/dashboard/extended-sessions
Patient Extended Portal: http://localhost:3000/dashboard/extended-sessions  
2-Hour Meeting Room: http://localhost:3000/meeting/extended-session-{roomId}
Session Analytics: http://localhost:3000/dashboard/session-analytics
Recording Access: http://localhost:3000/dashboard/recordings/extended
```

---

## 📊 **2-HOUR SESSION SUCCESS CRITERIA**

### **Technical Success Metrics**
- [ ] Complete 2-hour connection without major interruptions (<2 disconnections)
- [ ] HD video quality maintained for 90%+ of session
- [ ] Audio clarity and sync maintained throughout
- [ ] All file uploads/downloads successful (100% success rate)
- [ ] Chat functionality works seamlessly
- [ ] Recording captures entire session successfully
- [ ] System performance remains stable (CPU <70%, Memory <3GB)
- [ ] Browser doesn't crash or freeze

### **Clinical Success Metrics**  
- [ ] Provider able to conduct comprehensive assessment
- [ ] Patient comfortable and engaged throughout session
- [ ] All therapeutic objectives achieved
- [ ] Treatment plan successfully developed
- [ ] Follow-up appointments scheduled
- [ ] Emergency protocols available and tested
- [ ] Session summary generated and shared

### **User Experience Success Metrics**
- [ ] Both participants rate experience 4+/5
- [ ] Minimal technical difficulties (<5 minutes total)
- [ ] Easy navigation and feature usage
- [ ] Successful completion of all planned activities
- [ ] Effective communication throughout session
- [ ] Professional session environment maintained
- [ ] Positive feedback on platform capabilities

This extended test flow provides comprehensive coverage for 2-hour video consultation sessions with detailed technical requirements, emergency protocols, and success criteria.

---

## 🏥 **STANDARD PROVIDER TEST FLOW**

### **Phase 1: Provider Registration & Setup**

#### **Step 1: Provider Registration**
```
URL: http://localhost:3000/signup
Method: Register as Provider/Doctor

Test Data:
- Full Name: Dr. John Smith
- Email: doctor.john@example.com
- Phone: +1-555-0123
- Specialization: Psychiatrist
- License Number: MD123456
- Years of Experience: 10
- Password: Doctor@123
```

#### **Step 2: Provider Profile Setup**
```
URL: http://localhost:3000/dashboard/profile
Actions:
- Upload profile photo
- Set consultation fees
- Define availability hours
- Add qualifications and certifications
- Set consultation duration (15/30/45/60 minutes)
```

#### **Step 3: Provider Dashboard Access**
```
URL: http://localhost:3000/dashboard
Verify:
- Dashboard loads successfully
- Navigation menu available
- Quick stats visible
- Upcoming appointments section
```

### **Phase 2: Appointment Management**

#### **Step 4: Create Available Slots**
```
URL: http://localhost:3000/dashboard/schedule
Actions:
- Set available time slots for today and tomorrow
- Define break times
- Set maximum patients per slot
- Save schedule
```

#### **Step 5: View Appointment Requests**
```
URL: http://localhost:3000/dashboard/appointments
Actions:
- Check pending appointment requests
- Accept/reject appointments
- View patient details
- Reschedule if needed
```

---

## 👤 **STANDARD PATIENT TEST FLOW**

### **Phase 1: Patient Registration & Setup**

#### **Step 1: Patient Registration**
```
URL: http://localhost:3000/signup
Method: Register as Patient

Test Data:
- Full Name: Sarah Johnson
- Email: sarah.johnson@example.com
- Phone: +1-555-0456
- Date of Birth: 1990-05-15
- Gender: Female
- Address: 123 Main St, City, State 12345
- Emergency Contact: +1-555-0789
- Password: Patient@123
```

#### **Step 2: Patient Profile Setup**
```
URL: http://localhost:3000/dashboard/profile
Actions:
- Upload profile photo
- Add medical history
- List current medications
- Add allergies and conditions
- Set preferred communication language
```

### **Phase 2: Finding & Booking Provider**

#### **Step 3: Search for Providers**
```
URL: http://localhost:3000/dashboard/find-providers
Actions:
- Search by specialization: "Psychiatrist"
- Filter by availability: "Today/Tomorrow"
- Filter by rating: 4+ stars
- Filter by consultation fee range
- View provider profiles
```

#### **Step 4: Book Appointment**
```
URL: http://localhost:3000/dashboard/book-appointment
Actions:
- Select Dr. John Smith
- Choose available time slot
- Select consultation type: "Video Consultation"
- Add reason for visit: "Anxiety consultation"
- Upload relevant documents (optional)
- Confirm booking and payment
```

---

## 📞 **STANDARD CONSULTATION TEST FLOW**

### **Phase 3: Pre-Consultation**

#### **Step 5: Appointment Confirmation (Both Users)**
```
Provider:
- URL: http://localhost:3000/dashboard/appointments
- Actions: Confirm appointment, review patient details

Patient:
- URL: http://localhost:3000/dashboard/appointments
- Actions: View confirmed appointment, prepare for consultation
```

#### **Step 6: Pre-Call Preparation**
```
Provider:
- Review patient medical history
- Prepare consultation notes template
- Test camera/microphone
- Ensure stable internet connection

Patient:
- Find quiet, private space
- Test camera/microphone
- Prepare list of symptoms/questions
- Have ID and insurance ready if needed
```

### **Phase 4: Video Consultation**

#### **Step 7: Join Video Call (15 minutes before appointment)**
```
Provider Flow:
1. URL: http://localhost:3000/dashboard/consultations
2. Click "Join Meeting" for scheduled appointment
3. Test audio/video before patient joins
4. Wait for patient to join

Patient Flow:
1. URL: http://localhost:3000/dashboard/consultations
2. Click "Join Meeting" for scheduled appointment
3. Test audio/video before joining
4. Click "Join Now" to enter consultation room
```

#### **Step 8: Video Call Features Testing**
```
Meeting Room URL: http://localhost:3000/meeting/{roomId}

Test Features:
✅ Video Controls:
- Turn camera on/off
- Switch camera (front/back on mobile)
- Adjust video quality based on bandwidth

✅ Audio Controls:
- Mute/unmute microphone
- Adjust volume levels
- Test audio clarity

✅ Chat Features:
- Send text messages during call
- Share quick medical notes
- Send consultation summary

✅ File Sharing:
- Upload medical reports (PDF, images)
- Capture and share photos from camera
- Share prescription documents
- Download shared files

✅ Screen Sharing:
- Provider: Share medical charts or educational content
- Patient: Share health app data or documents

✅ Recording (if enabled):
- Start/stop consultation recording
- Save recording to consultation folder
- Generate consultation transcript
```

### **Phase 5: During Consultation**

#### **Step 9: Consultation Workflow**
```
Provider Actions:
1. Greet patient and verify identity
2. Review medical history and current symptoms
3. Conduct virtual examination (visual assessment)
4. Take consultation notes in real-time
5. Share educational materials via screen share
6. Explain diagnosis and treatment plan
7. Write digital prescription
8. Schedule follow-up if needed

Patient Actions:
1. Describe symptoms clearly
2. Ask questions about diagnosis
3. Share additional documents if requested
4. Take notes of provider recommendations
5. Confirm understanding of treatment plan
6. Request prescription copies
7. Schedule follow-up appointment
```

#### **Step 10: File Upload & Management**
```
Test S3 Integration:
1. Patient uploads lab reports during call
2. Provider captures and shares medical diagrams
3. System creates unique consultation folder:
   Format: /{patientPhone}_{date}_{providerID}/
   Example: /15550456_20250817_provider123/

4. All files automatically saved to consultation folder:
   - Chat transcript: consultation_chat.txt
   - Uploaded files: uploads/
   - Captured images: captures/
   - Recording: recording.mp4 (if enabled)
   - Consultation notes: notes.pdf
```

### **Phase 6: Post-Consultation**

#### **Step 11: Consultation Completion**
```
Provider Actions:
1. End video call
2. Complete consultation notes
3. Generate prescription (if applicable)
4. Create consultation summary
5. Upload all documents to patient folder
6. Send consultation summary to patient

Patient Actions:
1. Download consultation summary
2. Save prescription documents
3. Rate the consultation experience
4. Book follow-up if recommended
5. Access consultation history
```

#### **Step 12: Follow-up & History**
```
Provider Dashboard:
- URL: http://localhost:3000/dashboard/consultation-history
- View all past consultations
- Access patient files by consultation session
- Review chat transcripts and uploaded files

Patient Dashboard:
- URL: http://localhost:3000/dashboard/my-consultations
- Access consultation history
- Download previous prescriptions
- View shared documents from provider
- See consultation summaries
```

---

## 🧪 **TECHNICAL TESTING SCENARIOS**

### **Bandwidth & Quality Testing**
```
High Bandwidth (>2 Mbps):
- HD video quality (720p)
- Crystal clear audio
- Instant file sharing
- Real-time chat

Medium Bandwidth (1-2 Mbps):
- Standard video quality (480p)
- Good audio quality
- Slightly delayed file sharing
- Normal chat functionality

Low Bandwidth (<1 Mbps):
- Low video quality (360p) or audio-only mode
- Compressed audio
- Background file upload
- Chat priority over video
- Bandwidth warning notification
```

### **Device Compatibility Testing**
```
Desktop Browsers:
- Chrome, Firefox, Safari, Edge
- Test screen sharing and file upload

Mobile Devices:
- iOS Safari, Android Chrome
- Test camera switching (front/back)
- Test touch controls for video call

Tablet Devices:
- Test hybrid UI for medium screens
- Verify all buttons are accessible
- Test landscape/portrait modes
```

### **Security Testing**
```
Authentication:
- JWT token validation
- Session timeout handling
- Secure password requirements

Data Protection:
- HTTPS encryption for all communications
- WebRTC secure peer-to-peer connection
- Encrypted file storage in S3
- HIPAA compliance checks

Privacy:
- No recording without consent
- Secure chat encryption
- Automatic session cleanup
- Data retention policies
```

---

## 📊 **TEST VALIDATION CHECKLIST**

### **Registration & Authentication**
- [ ] Provider registration with license verification
- [ ] Patient registration with basic info
- [ ] Email verification process
- [ ] Password reset functionality
- [ ] Profile photo upload

### **Appointment Management**
- [ ] Provider schedule creation
- [ ] Patient appointment booking
- [ ] Appointment confirmation emails
- [ ] Reschedule functionality
- [ ] Cancellation with proper notice

### **Video Consultation**
- [ ] WebRTC connection establishment
- [ ] Audio/video quality control
- [ ] Chat functionality during call
- [ ] File upload/download during call
- [ ] Screen sharing capability
- [ ] Call recording (with consent)

### **File Management**
- [ ] S3 folder creation per consultation
- [ ] File upload to consultation folder
- [ ] Chat transcript generation
- [ ] Document download for patients
- [ ] Secure file access controls

### **Responsive Design**
- [ ] Mobile phone compatibility (iOS/Android)
- [ ] Tablet optimization
- [ ] Desktop browser support
- [ ] Touch-friendly controls
- [ ] Landscape/portrait mode support

### **Performance & Security**
- [ ] Bandwidth adaptation
- [ ] Low network warning system
- [ ] Secure WebRTC implementation
- [ ] Data encryption at rest and transit
- [ ] Session management and cleanup

---

## 🚀 **Quick Test Commands**

### **Backend API Testing**
```powershell
# Test OTP sending
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/send-otp" -Method POST -Body '{"phoneNumber": "+1-555-0123"}' -ContentType "application/json"

# Create a test meeting room
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/quick-create/test-room-001" -Method POST

# Get meeting room details
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/test-room-001" -Method GET

# Get all active meetings
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/active" -Method GET

# Verify OTP
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/verify-otp" -Method POST -Body '{"phoneNumber": "+1-555-0123", "otp": "123456"}' -ContentType "application/json"

# Join a meeting room
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/demo-test-001/join" -Method POST -Body '{"participantId": "patient123", "participantName": "Sarah Johnson", "participantEmail": "sarah.johnson@example.com"}' -ContentType "application/json"

# Login
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body '{"phoneNumber": "+1-555-0123", "password": "password123"}' -ContentType "application/json"
```

### **Frontend Access Points**
```
Provider Portal: http://localhost:3000/dashboard
Patient Portal: http://localhost:3000/dashboard
Meeting Room: http://localhost:3000/meeting/{roomId}
Registration: http://localhost:3000/signup
Login: http://localhost:3000/login
```

This comprehensive test flow covers the entire journey from registration to video consultation with all the features you mentioned including WebRTC, file sharing, chat, S3 integration, and responsive design.

## 🏥 **PROVIDER TEST FLOW**

### **Phase 1: Provider Registration & Setup**

#### **Step 1: Provider Registration**
```
URL: http://localhost:3000/signup
Method: Register as Provider/Doctor

Test Data:
- Full Name: Dr. John Smith
- Email: doctor.john@example.com
- Phone: +1-555-0123
- Specialization: Psychiatrist
- License Number: MD123456
- Years of Experience: 10
- Password: Doctor@123
```

#### **Step 2: Provider Profile Setup**
```
URL: http://localhost:3000/dashboard/profile
Actions:
- Upload profile photo
- Set consultation fees
- Define availability hours
- Add qualifications and certifications
- Set consultation duration (15/30/45/60 minutes)
```

#### **Step 3: Provider Dashboard Access**
```
URL: http://localhost:3000/dashboard
Verify:
- Dashboard loads successfully
- Navigation menu available
- Quick stats visible
- Upcoming appointments section
```

### **Phase 2: Appointment Management**

#### **Step 4: Create Available Slots**
```
URL: http://localhost:3000/dashboard/schedule
Actions:
- Set available time slots for today and tomorrow
- Define break times
- Set maximum patients per slot
- Save schedule
```

#### **Step 5: View Appointment Requests**
```
URL: http://localhost:3000/dashboard/appointments
Actions:
- Check pending appointment requests
- Accept/reject appointments
- View patient details
- Reschedule if needed
```

---

## 👤 **PATIENT TEST FLOW**

### **Phase 1: Patient Registration & Setup**

#### **Step 1: Patient Registration**
```
URL: http://localhost:3000/signup
Method: Register as Patient

Test Data:
- Full Name: Sarah Johnson
- Email: sarah.johnson@example.com
- Phone: +1-555-0456
- Date of Birth: 1990-05-15
- Gender: Female
- Address: 123 Main St, City, State 12345
- Emergency Contact: +1-555-0789
- Password: Patient@123
```

#### **Step 2: Patient Profile Setup**
```
URL: http://localhost:3000/dashboard/profile
Actions:
- Upload profile photo
- Add medical history
- List current medications
- Add allergies and conditions
- Set preferred communication language
```

### **Phase 2: Finding & Booking Provider**

#### **Step 3: Search for Providers**
```
URL: http://localhost:3000/dashboard/find-providers
Actions:
- Search by specialization: "Psychiatrist"
- Filter by availability: "Today/Tomorrow"
- Filter by rating: 4+ stars
- Filter by consultation fee range
- View provider profiles
```

#### **Step 4: Book Appointment**
```
URL: http://localhost:3000/dashboard/book-appointment
Actions:
- Select Dr. John Smith
- Choose available time slot
- Select consultation type: "Video Consultation"
- Add reason for visit: "Anxiety consultation"
- Upload relevant documents (optional)
- Confirm booking and payment
```

---

## 📞 **CONSULTATION TEST FLOW**

### **Phase 3: Pre-Consultation**

#### **Step 5: Appointment Confirmation (Both Users)**
```
Provider:
- URL: http://localhost:3000/dashboard/appointments
- Actions: Confirm appointment, review patient details

Patient:
- URL: http://localhost:3000/dashboard/appointments
- Actions: View confirmed appointment, prepare for consultation
```

#### **Step 6: Pre-Call Preparation**
```
Provider:
- Review patient medical history
- Prepare consultation notes template
- Test camera/microphone
- Ensure stable internet connection

Patient:
- Find quiet, private space
- Test camera/microphone
- Prepare list of symptoms/questions
- Have ID and insurance ready if needed
```

### **Phase 4: Video Consultation**

#### **Step 7: Join Video Call (15 minutes before appointment)**
```
Provider Flow:
1. URL: http://localhost:3000/dashboard/consultations
2. Click "Join Meeting" for scheduled appointment
3. Test audio/video before patient joins
4. Wait for patient to join

Patient Flow:
1. URL: http://localhost:3000/dashboard/consultations
2. Click "Join Meeting" for scheduled appointment
3. Test audio/video before joining
4. Click "Join Now" to enter consultation room
```

#### **Step 8: Video Call Features Testing**
```
Meeting Room URL: http://localhost:3000/meeting/{roomId}

Test Features:
✅ Video Controls:
- Turn camera on/off
- Switch camera (front/back on mobile)
- Adjust video quality based on bandwidth

✅ Audio Controls:
- Mute/unmute microphone
- Adjust volume levels
- Test audio clarity

✅ Chat Features:
- Send text messages during call
- Share quick medical notes
- Send consultation summary

✅ File Sharing:
- Upload medical reports (PDF, images)
- Capture and share photos from camera
- Share prescription documents
- Download shared files

✅ Screen Sharing:
- Provider: Share medical charts or educational content
- Patient: Share health app data or documents

✅ Recording (if enabled):
- Start/stop consultation recording
- Save recording to consultation folder
- Generate consultation transcript
```

### **Phase 5: During Consultation**

#### **Step 9: Consultation Workflow**
```
Provider Actions:
1. Greet patient and verify identity
2. Review medical history and current symptoms
3. Conduct virtual examination (visual assessment)
4. Take consultation notes in real-time
5. Share educational materials via screen share
6. Explain diagnosis and treatment plan
7. Write digital prescription
8. Schedule follow-up if needed

Patient Actions:
1. Describe symptoms clearly
2. Ask questions about diagnosis
3. Share additional documents if requested
4. Take notes of provider recommendations
5. Confirm understanding of treatment plan
6. Request prescription copies
7. Schedule follow-up appointment
```

#### **Step 10: File Upload & Management**
```
Test S3 Integration:
1. Patient uploads lab reports during call
2. Provider captures and shares medical diagrams
3. System creates unique consultation folder:
   Format: /{patientPhone}_{date}_{providerID}/
   Example: /15550456_20250817_provider123/

4. All files automatically saved to consultation folder:
   - Chat transcript: consultation_chat.txt
   - Uploaded files: uploads/
   - Captured images: captures/
   - Recording: recording.mp4 (if enabled)
   - Consultation notes: notes.pdf
```

### **Phase 6: Post-Consultation**

#### **Step 11: Consultation Completion**
```
Provider Actions:
1. End video call
2. Complete consultation notes
3. Generate prescription (if applicable)
4. Create consultation summary
5. Upload all documents to patient folder
6. Send consultation summary to patient

Patient Actions:
1. Download consultation summary
2. Save prescription documents
3. Rate the consultation experience
4. Book follow-up if recommended
5. Access consultation history
```

#### **Step 12: Follow-up & History**
```
Provider Dashboard:
- URL: http://localhost:3000/dashboard/consultation-history
- View all past consultations
- Access patient files by consultation session
- Review chat transcripts and uploaded files

Patient Dashboard:
- URL: http://localhost:3000/dashboard/my-consultations
- Access consultation history
- Download previous prescriptions
- View shared documents from provider
- See consultation summaries
```

---

## 🧪 **TECHNICAL TESTING SCENARIOS**

### **Bandwidth & Quality Testing**
```
High Bandwidth (>2 Mbps):
- HD video quality (720p)
- Crystal clear audio
- Instant file sharing
- Real-time chat

Medium Bandwidth (1-2 Mbps):
- Standard video quality (480p)
- Good audio quality
- Slightly delayed file sharing
- Normal chat functionality

Low Bandwidth (<1 Mbps):
- Low video quality (360p) or audio-only mode
- Compressed audio
- Background file upload
- Chat priority over video
- Bandwidth warning notification
```

### **Device Compatibility Testing**
```
Desktop Browsers:
- Chrome, Firefox, Safari, Edge
- Test screen sharing and file upload

Mobile Devices:
- iOS Safari, Android Chrome
- Test camera switching (front/back)
- Test touch controls for video call

Tablet Devices:
- Test hybrid UI for medium screens
- Verify all buttons are accessible
- Test landscape/portrait modes
```

### **Security Testing**
```
Authentication:
- JWT token validation
- Session timeout handling
- Secure password requirements

Data Protection:
- HTTPS encryption for all communications
- WebRTC secure peer-to-peer connection
- Encrypted file storage in S3
- HIPAA compliance checks

Privacy:
- No recording without consent
- Secure chat encryption
- Automatic session cleanup
- Data retention policies
```

---

## 📊 **TEST VALIDATION CHECKLIST**

### **Registration & Authentication**
- [ ] Provider registration with license verification
- [ ] Patient registration with basic info
- [ ] Email verification process
- [ ] Password reset functionality
- [ ] Profile photo upload

### **Appointment Management**
- [ ] Provider schedule creation
- [ ] Patient appointment booking
- [ ] Appointment confirmation emails
- [ ] Reschedule functionality
- [ ] Cancellation with proper notice

### **Video Consultation**
- [ ] WebRTC connection establishment
- [ ] Audio/video quality control
- [ ] Chat functionality during call
- [ ] File upload/download during call
- [ ] Screen sharing capability
- [ ] Call recording (with consent)

### **File Management**
- [ ] S3 folder creation per consultation
- [ ] File upload to consultation folder
- [ ] Chat transcript generation
- [ ] Document download for patients
- [ ] Secure file access controls

### **Responsive Design**
- [ ] Mobile phone compatibility (iOS/Android)
- [ ] Tablet optimization
- [ ] Desktop browser support
- [ ] Touch-friendly controls
- [ ] Landscape/portrait mode support

### **Performance & Security**
- [ ] Bandwidth adaptation
- [ ] Low network warning system
- [ ] Secure WebRTC implementation
- [ ] Data encryption at rest and transit
- [ ] Session management and cleanup

---

## 🚀 **Quick Test Commands**

### **Backend API Testing**
```powershell
# Test OTP sending
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/send-otp" -Method POST -Body '{"phoneNumber": "+1-555-0123"}' -ContentType "application/json"

# Create a test meeting room
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/quick-create/test-room-001" -Method POST

# Get meeting room details
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/test-room-001" -Method GET

# Get all active meetings
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/active" -Method GET

# Verify OTP
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/verify-otp" -Method POST -Body '{"phoneNumber": "+1-555-0123", "otp": "123456"}' -ContentType "application/json"

# Join a meeting room
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/demo-test-001/join" -Method POST -Body '{"participantId": "patient123", "participantName": "Sarah Johnson", "participantEmail": "sarah.johnson@example.com"}' -ContentType "application/json"

# Login
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body '{"phoneNumber": "+1-555-0123", "password": "password123"}' -ContentType "application/json"
```

### **Frontend Access Points**
```
Provider Portal: http://localhost:3000/dashboard
Patient Portal: http://localhost:3000/dashboard
Meeting Room: http://localhost:3000/meeting/{roomId}
Registration: http://localhost:3000/signup
Login: http://localhost:3000/login
```

This comprehensive test flow covers the entire journey from registration to video consultation with all the features you mentioned including WebRTC, file sharing, chat, S3 integration, and responsive design.


@{id=2; roomId=demo-test-001; roomName=Demo Meeting - demo-test-001;     
                   description=Quick demo meeting room; hostId=1; hostName=Demo Host;       
                   scheduledStartTime=2025-08-17T11:02:36.7132759;
                   scheduledEndTime=2025-08-17T11:17:36.7132759; actualStartTime=;
                   actualEndTime=; durationMinutes=15; maxParticipants=10;
                   status=SCHEDULED; isRecordingEnabled=True; isChatEnabled=True;
                   isFileSharingEnabled=True; isScreenSharingEnabled=True;
                   isCameraEnabled=True; activeParticipantsCount=0;
                   joinUrl=/dashboard/meeting/demo-test-001;
                   createdAt=2025-08-17T11:02:36.8339944;
                   updatedAt=2025-08-17T11:02:36.8339944}

---

## 🔗 **COMPREHENSIVE LINK REFERENCE GUIDE**

### **Frontend Access Points**
```
# Main Application URLs
Provider Portal: http://localhost:3000/dashboard
Patient Portal: http://localhost:3000/dashboard
Meeting Room: http://localhost:3000/meeting/{roomId}
Registration: http://localhost:3000/signup
Login: http://localhost:3000/login

# Extended Session URLs
Provider Extended Portal: http://localhost:3000/dashboard/extended-sessions
Patient Extended Portal: http://localhost:3000/dashboard/extended-sessions  
2-Hour Meeting Room: http://localhost:3000/meeting/extended-session-{roomId}
Session Analytics: http://localhost:3000/dashboard/session-analytics
Recording Access: http://localhost:3000/dashboard/recordings/extended

# Dashboard Sub-pages
Profile Management: http://localhost:3000/dashboard/profile
Schedule Management: http://localhost:3000/dashboard/schedule
Appointments: http://localhost:3000/dashboard/appointments
Consultations: http://localhost:3000/dashboard/consultations
Find Providers: http://localhost:3000/dashboard/find-providers
Book Appointment: http://localhost:3000/dashboard/book-appointment
Consultation History: http://localhost:3000/dashboard/consultation-history
My Consultations: http://localhost:3000/dashboard/my-consultations

# Test Pages (for development/testing)
Video Call Test: http://localhost:3000/test-video
WebSocket Test: http://localhost:3000/test-websocket
Simple Test: http://localhost:3000/test-simple
```

### **Backend API Endpoints**
```
# Authentication APIs
POST http://localhost:8080/api/auth/send-otp
POST http://localhost:8080/api/auth/verify-otp
POST http://localhost:8080/api/auth/login
POST http://localhost:8080/api/auth/register
POST http://localhost:8080/api/auth/logout

# Meeting Management APIs
POST http://localhost:8080/api/v1/meetings/quick-create/{roomId}
POST http://localhost:8080/api/v1/meetings/create-extended
GET  http://localhost:8080/api/v1/meetings/{roomId}
GET  http://localhost:8080/api/v1/meetings/active
POST http://localhost:8080/api/v1/meetings/{roomId}/join
POST http://localhost:8080/api/v1/meetings/{roomId}/leave
DELETE http://localhost:8080/api/v1/meetings/{roomId}

# Extended Session APIs
GET  http://localhost:8080/api/v1/meetings/{sessionId}/performance
GET  http://localhost:8080/api/v1/meetings/{sessionId}/recording/status
GET  http://localhost:8080/api/v1/meetings/{sessionId}/files
POST http://localhost:8080/api/v1/meetings/{sessionId}/upload
GET  http://localhost:8080/api/v1/meetings/{sessionId}/download/{fileId}

# Video Configuration APIs
GET  http://localhost:8080/api/video/webrtc-config
GET  http://localhost:8080/api/video/stun-turn-servers
POST http://localhost:8080/api/video/quality-test

# WebSocket Endpoints
WS   ws://localhost:8080/api/ws/rtc?sessionId={sessionId}
WS   ws://localhost:8080/api/ws/chat?roomId={roomId}
WS   ws://localhost:8080/api/ws/file-transfer?sessionId={sessionId}

# File Management APIs
POST http://localhost:8080/api/files/upload
GET  http://localhost:8080/api/files/{fileId}
DELETE http://localhost:8080/api/files/{fileId}
GET  http://localhost:8080/api/files/session/{sessionId}
```

### **Quick Test Links - Ready to Use**
```
# Test existing meeting room
Direct Meeting Access: http://localhost:3000/meeting/demo-test-001

# Test video call features
Video Test Page: http://localhost:3000/test-video

# Test WebSocket connection
WebSocket Test Page: http://localhost:3000/test-websocket

# Test backend APIs (use in PowerShell)
Test OTP: Invoke-RestMethod -Uri "http://localhost:8080/api/auth/send-otp" -Method POST -Body '{"phoneNumber": "+1-555-0123"}' -ContentType "application/json"

Test Meeting Creation: Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/quick-create/test-room-$(Get-Date -Format 'MMddHHmm')" -Method POST

Test Active Meetings: Invoke-RestMethod -Uri "http://localhost:8080/api/v1/meetings/active" -Method GET

Test WebRTC Config: Invoke-RestMethod -Uri "http://localhost:8080/api/video/webrtc-config" -Method GET
```

### **Working Links (Tested)**
```
✅ Backend API Base: http://localhost:8080
✅ WebRTC Config: http://localhost:8080/api/video/webrtc-config
✅ Active Meetings: http://localhost:8080/api/v1/meetings/active
✅ WebSocket RTC: ws://localhost:8080/api/ws/rtc?sessionId={sessionId}

✅ Frontend Base: http://localhost:3000
✅ Video Test Page: http://localhost:3000/test-video
✅ WebSocket Test Page: http://localhost:3000/test-websocket
✅ Meeting Room: http://localhost:3000/meeting/demo-test-001
```

### **Link Status Check Commands**
```powershell
# Quick link validation script
$links = @{
    "Frontend" = @(
        "http://localhost:3000",
        "http://localhost:3000/test-video",
        "http://localhost:3000/test-websocket",
        "http://localhost:3000/meeting/demo-test-001"
    )
    "Backend" = @(
        "http://localhost:8080/api/video/webrtc-config",
        "http://localhost:8080/api/v1/meetings/active"
    )
}

foreach ($category in $links.Keys) {
    Write-Host "`n=== $category Links ===" -ForegroundColor Yellow
    foreach ($url in $links[$category]) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method HEAD -TimeoutSec 5
            Write-Host "✅ $url - Status: $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "❌ $url - Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
```