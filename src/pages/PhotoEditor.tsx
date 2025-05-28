
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ShoppingCart, RotateCw, Palette, Crop, Frame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { storage, Session } from '@/lib/storage';

const PhotoEditor = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editSettings, setEditSettings] = useState({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    rotation: 0,
    filter: 'none'
  });
  const { toast } = useToast();

  const filters = ['none', 'sepia', 'grayscale', 'vintage', 'warm', 'cool'];

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

  const handleEditChange = (key: string, value: number | string) => {
    setEditSettings(prev => ({ ...prev, [key]: value }));
  };

  const getFilterStyle = () => {
    const { brightness, contrast, saturation, rotation, filter } = editSettings;
    
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    switch (filter) {
      case 'sepia':
        filterString += ' sepia(100%)';
        break;
      case 'grayscale':
        filterString += ' grayscale(100%)';
        break;
      case 'vintage':
        filterString += ' sepia(50%) contrast(120%) brightness(110%)';
        break;
      case 'warm':
        filterString += ' hue-rotate(15deg) saturate(120%)';
        break;
      case 'cool':
        filterString += ' hue-rotate(-15deg) saturate(110%)';
        break;
    }
    
    return {
      filter: filterString,
      transform: `rotate(${rotation}deg)`
    };
  };

  const proceedToCheckout = () => {
    // Store edit settings for checkout
    localStorage.setItem(`editedPhotos_${sessionId}`, JSON.stringify({
      photoIds: selectedPhotos,
      settings: editSettings
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
                  return (
                    <div
                      key={photoId}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhoto === photoId ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPhoto(photoId)}
                    >
                      <img
                        src={photo?.url}
                        alt={photo?.originalName}
                        className="w-full h-20 object-cover"
                      />
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
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {currentPhoto && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.originalName}
                    className="w-full h-full object-cover"
                    style={getFilterStyle()}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editing Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Filter</label>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter}
                      variant={editSettings.filter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEditChange('filter', filter)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Brightness */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Brightness: {editSettings.brightness}%
                </label>
                <Slider
                  value={[editSettings.brightness]}
                  onValueChange={(value) => handleEditChange('brightness', value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              {/* Contrast */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contrast: {editSettings.contrast}%
                </label>
                <Slider
                  value={[editSettings.contrast]}
                  onValueChange={(value) => handleEditChange('contrast', value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              {/* Saturation */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Saturation: {editSettings.saturation}%
                </label>
                <Slider
                  value={[editSettings.saturation]}
                  onValueChange={(value) => handleEditChange('saturation', value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rotation: {editSettings.rotation}°
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditChange('rotation', editSettings.rotation - 90)}
                  >
                    <RotateCw className="w-4 h-4 mr-1 rotate-180" />
                    -90°
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditChange('rotation', editSettings.rotation + 90)}
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    +90°
                  </Button>
                </div>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditSettings({
                  brightness: 50,
                  contrast: 50,
                  saturation: 50,
                  rotation: 0,
                  filter: 'none'
                })}
              >
                Reset All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-gray-600">
            {selectedPhotos.length} photos ready for editing
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
