
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { storage, Session } from '@/lib/storage';
import { fileManager } from '@/lib/fileManager';

const SessionManagement = () => {
  const { sessionId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      const sessionData = storage.getSessionById(sessionId);
      setSession(sessionData);
    }
  }, [sessionId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToSession = async () => {
    if (!sessionId) return;

    try {
      const results = await fileManager.processMultiplePhotoUploads(sessionId, selectedFiles as any);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        // Refresh session data
        const updatedSession = storage.getSessionById(sessionId);
        setSession(updatedSession);
        
        toast({
          title: "Photos Uploaded",
          description: `${successCount} photos uploaded successfully!`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: "Upload Issues",
          description: `${failCount} photos failed to upload.`,
          variant: "destructive",
        });
      }
      
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeUploadedPhoto = (photoId: string) => {
    if (!sessionId) return;
    
    storage.removePhotoFromSession(sessionId, photoId);
    const updatedSession = storage.getSessionById(sessionId);
    setSession(updatedSession);
    
    toast({
      title: "Photo Removed",
      description: "Photo has been removed from the session.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/photographer/dashboard">
            <Button variant="ghost" className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-green-700">Session: {sessionId}</h1>
        </div>

        {/* Photo Upload Section */}
        <Card className="mb-6 shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Camera className="w-6 h-6 mr-2" />
              Upload Photos
            </CardTitle>
            <CardDescription>
              Select and upload photos for this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">Select Photos</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>

              {/* Preview Grid */}
              {selectedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Selected Photos ({selectedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={uploadToSession}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to Session ({selectedFiles.length} photos)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Photos Grid */}
        {session && session.photos.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-green-700">Session Photos ({session.photos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {session.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.originalName}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUploadedPhoto(photo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                      {photo.originalName}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SessionManagement;
