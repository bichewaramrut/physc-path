'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { Document } from '@/lib/api/medicalRecords';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  AlertCircle, 
  ArrowLeft, 
  FileText, 
  Edit3, 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  Tag,
  User,
  FileType
} from 'lucide-react';
import Link from 'next/link';

interface MedicalRecordDetailParams {
  params: {
    id: string;
  };
}

export default function MedicalRecordDetail({ params }: MedicalRecordDetailParams) {
  const router = useRouter();
  const { id } = params;
  const { fetchMedicalRecord, currentRecord, updateMedicalRecord, deleteMedicalRecord, uploadDocument, deleteDocument, loading, error } = useMedicalRecords();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMedicalRecord = async () => {
      setIsLoading(true);
      const record = await fetchMedicalRecord(id);
      if (record) {
        // Initialize form values from record data
        setTitle(record.title);
        setDescription(record.description);
        setTags(record.tags || []);
      }
      setIsLoading(false);
    };
    
    loadMedicalRecord();
  }, [fetchMedicalRecord, id]);

  const handleSave = async () => {
    await updateMedicalRecord(id, {
      title,
      description,
      tags
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
      const success = await deleteMedicalRecord(id);
      if (success) {
        router.push('/dashboard/medical-records');
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      setIsUploading(true);
      try {
        await uploadDocument(id, file);
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id, documentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'DIAGNOSIS':
        return 'Diagnosis';
      case 'TEST_RESULT':
        return 'Test Result';
      case 'PRESCRIPTION':
        return 'Prescription';
      case 'CONSULTATION_NOTES':
        return 'Consultation Notes';
      default:
        return 'Other';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !currentRecord) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error
          </h2>
          <p className="mt-2 text-red-600">
            {error || 'Medical record not found. It may have been deleted or you may not have permission to view it.'}
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard/medical-records')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Medical Records
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/medical-records" 
          className="text-gray-500 hover:text-gray-700 inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Medical Records
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getRecordTypeLabel(currentRecord.recordType)}
              </span>
              {isEditing ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold w-full border-b border-gray-300 focus:border-primary focus:outline-none py-1"
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold mt-2">
                  {currentRecord.title}
                </h1>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              )}
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(currentRecord.date)}</p>
              </div>
            </div>

            {currentRecord.doctorId && (
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{currentRecord.doctorName || 'Unknown'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Enter description..."
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                {currentRecord.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{currentRecord.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description provided.</p>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag"
                  className="w-full border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary px-3 py-1"
                />
                <Button
                  onClick={handleAddTag}
                  type="button"
                  className="rounded-l-none"
                >
                  Add
                </Button>
              </div>
            </div>
          ) : tags.length > 0 && (
            <div className="mt-6 flex items-start gap-2">
              <Tag className="text-gray-400 mt-0.5" size={16} />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Documents</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </label>
              </div>
              {file && (
                <Button
                  onClick={handleFileUpload}
                  disabled={isUploading || !file}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              )}
            </div>
          </div>

          {file && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-700">Selected file: {file.name}</p>
              <p className="text-xs text-blue-600">{formatFileSize(file.size)}</p>
            </div>
          )}

          {currentRecord.documents.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-md">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {currentRecord.documents.map((document: Document) => (
                  <li key={document.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <FileType className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{document.fileName}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(document.fileSize)} · Uploaded {formatDate(document.uploadDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
