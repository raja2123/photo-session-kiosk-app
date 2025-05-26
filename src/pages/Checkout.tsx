
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Download, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { sessionId } = useParams();
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  // Mock data
  const orderData = {
    sessionId: sessionId,
    sessionName: 'Beach Photo Session',
    location: 'Marina Beach, Chennai',
    plan: 'Standard',
    photoCount: 3,
    price: 250,
    photos: [
      { id: 1, name: 'Photo 1', url: '/placeholder.svg?height=150&width=150&text=Photo1' },
      { id: 2, name: 'Photo 2', url: '/placeholder.svg?height=150&width=150&text=Photo2' },
      { id: 3, name: 'Photo 3', url: '/placeholder.svg?height=150&width=150&text=Photo3' },
    ]
  };

  const handleCheckout = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully!",
        description: "Your photos are being prepared for printing. Invoice generated.",
      });
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/user/session/${sessionId}/editor`}>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-700">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Session Information</h3>
                    <p className="text-gray-600">Session: {orderData.sessionName}</p>
                    <p className="text-gray-600">Location: {orderData.location}</p>
                    <p className="text-gray-600">Session ID: {orderData.sessionId}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold">Package Details</h3>
                    <p className="text-gray-600">Plan: {orderData.plan}</p>
                    <p className="text-gray-600">Photos: {orderData.photoCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Preview */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-700">Selected Photos</CardTitle>
                <CardDescription>
                  Preview of your edited photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {orderData.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-700">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{orderData.plan} Package</span>
                    <span>₹{orderData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Photos ({orderData.photoCount})</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Editing</span>
                    <span>Included</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{orderData.price}</span>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processing ? (
                      'Processing...'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Payment will be processed offline at the photo kiosk
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
