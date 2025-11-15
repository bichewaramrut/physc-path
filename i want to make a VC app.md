i want to make a VC app
using GRPTC create a interface for video/audio streaming along with backend implimenation, i see last time you had some implinenation but not sure how much it is, 
now we want a ui interface where we can do texting, attchment , camera, video and audio
with texting, attchment, camera should support to send the data while consultation, 
this attchment/camera capture item should upload to aws s3 via back,
foe each consulation it should a unique folder to store the consultation data like (patient mobile number/ date+doctor or provider id) so we can divide muultple session, and that session info/meta data store in DB for retrive on demand 
ex: while next consulation if need so see old session/ consulation data so that we can see on separate window as history record
whatever texting happing in session what should be generate the text file before clsoiing sesion  and update to the same session/ consulation folder on s3
im looking for simplified app like MS team , no extra things, only cal video texting and attchment(that could update from system or capture from camera)
we should need to take care about internet badwidth if we have low badwidth so resolution show not be go down or need to have standard minimun badwidth define so we can inform user about low quality or poor network

ui should be very much fine and can load on phone/tab and all size or screen
backend should be web RTC for stream
i was thing to host myself all server so design in such way where security and cost also be major factor


 638d477b-1dfb-478b-b46c-8357a38636ae