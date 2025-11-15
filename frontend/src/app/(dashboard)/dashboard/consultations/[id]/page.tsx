'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConsultations } from '@/hooks/useConsultations';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  FileText, 
  AlertCircle, 
  Edit3, 
  Save, 
  ArrowLeft,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

interface ConsultationDetailParams {
  params: {
    id: string;
  };
}

export default function ConsultationDetail({ params }: ConsultationDetailParams) {
  const router = useRouter();
  const { id } = params;
  const { fetchConsultation, currentConsultation, updateNotes, updateConsultation, endConsultation, loading, error } = useConsultations();
  const { createPrescription } = usePrescriptions();
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConsultation = async () => {
      setIsLoading(true);
      const consultation = await fetchConsultation(id);
      if (consultation) {
        // Initialize form values from consultation data
        setNotes(consultation.notes?.[consultation.notes.length - 1]?.content || '');
        setDiagnosis(consultation.diagnosis || '');
        setRecommendations(consultation.recommendations || '');
        setFollowUpRequired(consultation.followUpRequired);
      }
      setIsLoading(false);
    };
    
    loadConsultation();
  }, [fetchConsultation, id]);

  const handleSaveNotes = async () => {
    await updateNotes(id, notes);
    setEditingNotes(false);
  };

  const handleSaveDiagnosis = async () => {
    await updateConsultation(id, {
      diagnosis,
      recommendations,
      followUpRequired
    });
    setEditingDiagnosis(false);
  };

  const handleEndConsultation = async () => {
    if (confirm('Are you sure you want to end this consultation?')) {
      await endConsultation(id);
    }
  };

  const handleCreatePrescription = async () => {
    if (!currentConsultation) return;
    
    try {
      // Create a basic prescription from consultation data
      const newPrescription = await createPrescription({
        consultationId: currentConsultation.id,
        patientId: currentConsultation.patientId,
        doctorId: currentConsultation.doctorId,
        patientName: currentConsultation.patientName,
        doctorName: currentConsultation.doctorName,
        medications: [],
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'ACTIVE',
        notes: `Prescription based on consultation from ${new Date(currentConsultation.startTime).toLocaleDateString()}`
      });
      
      if (newPrescription) {
        router.push(`/dashboard/prescriptions/${newPrescription.id}?edit=true`);
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !currentConsultation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error
          </h2>
          <p className="mt-2 text-red-600">
            {error || 'Consultation not found. It may have been deleted or you may not have permission to view it.'}
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard/consultations')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Consultations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/consultations" 
          className="text-gray-500 hover:text-gray-700 inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Consultations
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Consultation Details
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(currentConsultation.status)}`}>
              {currentConsultation.status.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(currentConsultation.startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {formatTime(currentConsultation.startTime)}
                  {currentConsultation.endTime && ` - ${formatTime(currentConsultation.endTime)}`}
                </p>
                {currentConsultation.duration && (
                  <p className="text-sm text-gray-500">Duration: {currentConsultation.duration} minutes</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{currentConsultation.doctorName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{currentConsultation.patientName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Consultation Notes</h2>
            {!editingNotes ? (
              <Button
                onClick={() => setEditingNotes(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" /> Edit Notes
              </Button>
            ) : (
              <Button
                onClick={handleSaveNotes}
                size="sm"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Save className="h-4 w-4" /> Save Notes
              </Button>
            )}
          </div>
          
          {editingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter consultation notes here..."
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
              {notes ? (
                <p className="whitespace-pre-wrap">{notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes recorded for this consultation.</p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Diagnosis & Recommendations</h2>
            {!editingDiagnosis ? (
              <Button
                onClick={() => setEditingDiagnosis(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
            ) : (
              <Button
                onClick={handleSaveDiagnosis}
                size="sm"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Save className="h-4 w-4" /> Save
              </Button>
            )}
          </div>
          
          {editingDiagnosis ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Enter diagnosis..."
                />
              </div>
              
              <div>
                <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Recommendations
                </label>
                <textarea
                  id="recommendations"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Enter recommendations..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="followUp"
                  type="checkbox"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="followUp" className="ml-2 block text-sm text-gray-700">
                  Follow-up appointment required
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Diagnosis</h3>
                <div className="bg-gray-50 p-3 rounded-md mt-1">
                  {diagnosis ? (
                    <p>{diagnosis}</p>
                  ) : (
                    <p className="text-gray-500 italic">No diagnosis recorded.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700">Treatment Recommendations</h3>
                <div className="bg-gray-50 p-3 rounded-md mt-1">
                  {recommendations ? (
                    <p>{recommendations}</p>
                  ) : (
                    <p className="text-gray-500 italic">No recommendations recorded.</p>
                  )}
                </div>
              </div>
              
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${followUpRequired ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {followUpRequired ? 'Follow-up required' : 'No follow-up required'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            {currentConsultation.status === 'IN_PROGRESS' && currentConsultation.videoSessionId && (
              <Link href={`/video-call/${currentConsultation.videoSessionId}`}>
                <Button className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Join Video Call
                </Button>
              </Link>
            )}
            
            <Button
              onClick={handleCreatePrescription}
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Prescription
            </Button>
            
            {currentConsultation.status === 'IN_PROGRESS' && (
              <Button
                onClick={handleEndConsultation}
                variant="default"
                className="ml-auto"
                disabled={loading}
              >
                End Consultation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
