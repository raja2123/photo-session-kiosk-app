
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PhotoSelection = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const { toast } = useToast();

  const plans = [
    { id: 'basic', name: 'Basic', photos: 2, price: 100, color: 'bg-gray-500' },
    { id: 'standard', name: 'Standard', photos: 5, price: 250, color: 'bg-blue-500' },
    { id: 'premium', name: 'Premium', photos: 10, price: 500, color: 'bg-purple-500' },
    { id: 'unlimited', name: 'Unlimited', photos: 20, price: 1000, color: 'bg-gold-500' },
  ];

  // Mock photos
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Photo ${i + 1}`,
    url: `/placeholder.svg?height=200&width=200&text=Photo${i + 1}`
  }));

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setSelectedPhotos([]);
  };

  const togglePhotoSelection = (photoId: number) => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(prev => prev.filter(id => id !== photoId));
    } else {
      if (selectedPhotos.length < plan.photos) {
        setSelectedPhotos(prev => [...prev, photoId]);
      } else {
        toast({
          title: "Photo Limit Reached",
          description: `You can only select ${plan.photos} photos with the ${plan.name} plan.`,
          variant: "destructive",
        });
      }
    }
  };

  const proceedToEditor = () => {
    if (selectedPhotos.length === 0) {
      toast({
        title: "No Photos Selected",
        description: "Please select at least one photo to continue.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/user/session/${sessionId}/editor`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/user/session/${sessionId}`}>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-700">Select Your Package</h1>
        </div>

        {/* Package Selection */}
        {!selectedPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="cursor-pointer shadow-xl border-0 bg-white/90 backdrop-blur hover:scale-105 transition-transform"
                onClick={() => handlePlanSelect(plan.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mb-4`}>
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    Up to {plan.photos} photos
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-4">
                    ₹{plan.price}
                  </div>
                  <Button className={`w-full ${plan.color} hover:opacity-90`}>
                    Select {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Photo Grid */}
        {selectedPlan && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">Select Your Photos</h2>
                <p className="text-gray-600">
                  Choose {plans.find(p => p.id === selectedPlan)?.photos} photos from the session
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-lg p-2">
                  {selectedPhotos.length} / {plans.find(p => p.id === selectedPlan)?.photos} selected
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                    selectedPhotos.includes(photo.id)
                      ? 'border-blue-500 scale-95'
                      : 'border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => togglePhotoSelection(photo.id)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-48 object-cover"
                  />
                  {selectedPhotos.includes(photo.id) && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setSelectedPlan(null)}
              >
                Change Package
              </Button>
              <Button
                onClick={proceedToEditor}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={selectedPhotos.length === 0}
              >
                Proceed to Editor ({selectedPhotos.length} photos)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSelection;
