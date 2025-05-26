
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SessionManagement = () => {
  const { sessionId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const { toast } = useToast();

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

  const uploadToSession = () => {
    // Simulate photo upload
    const newPhotos = selectedFiles.map((file, index) => 
      `photo_${Date.now()}_${index}.jpg`
    );
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setSelectedFiles([]);
    toast({
      title: "Photos Uploaded",
      description: `${newPhotos.length} photos uploaded to session successfully!`,
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
        {uploadedPhotos.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-green-700">Session Photos ({uploadedPhotos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">{photo}</span>
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
