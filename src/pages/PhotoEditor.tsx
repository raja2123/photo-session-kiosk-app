
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { storage, Session } from '@/lib/storage';
import TUIImageEditor from '@/components/TUIImageEditor';

const PhotoEditor = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editedPhotos, setEditedPhotos] = useState<{ [key: string]: string }>({});
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      const sessionData = storage.getSessionById(sessionId);
      setSession(sessionData);
      
      // Get selected photos from localStorage
      const storedSelection = localStorage.getItem(`selectedPhotos_${sessionId}`);
      if (storedSelection) {
        const { photoIds } = JSON.parse(storedSelection);
        setSelectedPhotos(photoIds);
        if (photoIds.length > 0) {
          setSelectedPhoto(photoIds[0]);
        }
      }
    }
  }, [sessionId]);

  const handleEditPhoto = () => {
    if (selectedPhoto) {
      setShowEditor(true);
    }
  };

  const handleSaveEdit = (editedImageData: string) => {
    if (selectedPhoto) {
      setEditedPhotos(prev => ({ ...prev, [selectedPhoto]: editedImageData }));
      setShowEditor(false);
      toast({
        title: "Photo Edited",
        description: "Your photo has been successfully edited.",
      });
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const proceedToCheckout = () => {
    // Store edit settings for checkout
    localStorage.setItem(`editedPhotos_${sessionId}`, JSON.stringify({
      photoIds: selectedPhotos,
      editedPhotos: editedPhotos
    }));
    
    toast({
      title: "Editing Complete",
      description: "Proceeding to checkout...",
    });
    navigate(`/user/session/${sessionId}/checkout`);
  };

  const currentPhoto = session?.photos.find(p => p.id === selectedPhoto);

  if (!session) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session not found</h2>
          <Link to="/user">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showEditor && currentPhoto) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <TUIImageEditor
          imageUrl={editedPhotos[selectedPhoto!] || currentPhoto.url}
          onSave={handleSaveEdit}
          onClose={handleCloseEditor}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/user/session/${sessionId}/photos`}>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-700">Photo Editor</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Thumbnails */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Selected Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPhotos.map((photoId) => {
                  const photo = session.photos.find(p => p.id === photoId);
                  const isEdited = editedPhotos[photoId];
                  return (
                    <div
                      key={photoId}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhoto === photoId ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPhoto(photoId)}
                    >
                      <div className="relative">
                        <img
                          src={isEdited || photo?.url}
                          alt={photo?.originalName}
                          className="w-full h-20 object-cover"
                        />
                        {isEdited && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                            Edited
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-xs text-gray-600">
                        {photo?.originalName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Photo Display */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Preview
                {currentPhoto && (
                  <Button
                    onClick={handleEditPhoto}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Edit Photo
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPhoto && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={editedPhotos[selectedPhoto!] || currentPhoto.url}
                    alt={currentPhoto.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {!currentPhoto && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Select a photo to preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-gray-600">
            {selectedPhotos.length} photos ready for editing
            {Object.keys(editedPhotos).length > 0 && (
              <span className="ml-2 text-green-600">
                ({Object.keys(editedPhotos).length} edited)
              </span>
            )}
          </div>
          <Button
            onClick={proceedToCheckout}
            className="bg-green-600 hover:bg-green-700"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
