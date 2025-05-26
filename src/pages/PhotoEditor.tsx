
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PhotoEditor = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const { toast } = useToast();

  // Mock selected photos (would come from previous step)
  const photos = [
    { id: 1, name: 'Photo 1', url: '/placeholder.svg?height=300&width=300&text=Photo1' },
    { id: 2, name: 'Photo 2', url: '/placeholder.svg?height=300&width=300&text=Photo2' },
    { id: 3, name: 'Photo 3', url: '/placeholder.svg?height=300&width=300&text=Photo3' },
  ];

  const proceedToCheckout = () => {
    toast({
      title: "Editing Complete",
      description: "Proceeding to checkout...",
    });
    navigate(`/user/session/${sessionId}/checkout`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
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

        {/* Editor Interface */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-blue-700">
              <Edit className="w-6 h-6 mr-2" />
              Editor
            </CardTitle>
            <CardDescription>
              Click on any photo to edit. Customize each photo individually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all hover:scale-105 ${
                    selectedPhoto === photo.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPhoto(photo.id)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all">
                    <div className="text-white font-semibold opacity-0 hover:opacity-100 transition-opacity">
                      Click to Edit
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing Tools Placeholder */}
            {selectedPhoto && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Editing Photo {selectedPhoto}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="text-sm">Filters</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="text-sm">Adjust</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="text-sm">Crop</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="text-sm">Border</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div className="text-gray-600">
                {photos.length} photos ready for editing
              </div>
              <Button
                onClick={proceedToCheckout}
                className="bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotoEditor;
