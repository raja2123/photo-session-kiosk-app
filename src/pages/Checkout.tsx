
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/storage';
import Bill from '@/components/Bill';

const Checkout = () => {
  const { sessionId } = useParams();
  const [processing, setProcessing] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      // Get session data
      const session = storage.getSessionById(sessionId);
      
      // Get selected photos
      const storedSelection = localStorage.getItem(`selectedPhotos_${sessionId}`);
      
      // Get edited photos
      const editedPhotosData = localStorage.getItem(`editedPhotos_${sessionId}`);
      
      if (session && storedSelection) {
        const { photoIds } = JSON.parse(storedSelection);
        let editedPhotos = {};
        
        if (editedPhotosData) {
          const { editedPhotos: edited } = JSON.parse(editedPhotosData);
          editedPhotos = edited || {};
        }

        // Prepare photos with edited versions
        const selectedPhotos = photoIds.map((photoId: string) => {
          const photo = session.photos.find((p: any) => p.id === photoId);
          return {
            id: photoId,
            name: photo?.originalName || `Photo ${photoId}`,
            url: editedPhotos[photoId] || photo?.url || '/placeholder.svg'
          };
        });

        setOrderData({
          sessionId: sessionId,
          sessionName: session.sessionName,
          location: session.location,
          plan: 'Standard',
          photoCount: photoIds.length,
          price: photoIds.length * 85, // ₹85 per photo
          orderDate: new Date().toLocaleDateString(),
          photos: selectedPhotos
        });
      }
    }
  }, [sessionId]);

  const handleCheckout = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowBill(true);
    }, 2000);
  };

  const handlePrintBill = () => {
    // Add order to print queue
    if (orderData) {
      const printRequest = {
        ...orderData,
        id: Date.now(),
        customerName: 'Customer',
        status: 'pending',
        totalAmount: orderData.price
      };
      
      // Store in localStorage for print queue
      const existingQueue = JSON.parse(localStorage.getItem('printQueue') || '[]');
      existingQueue.push(printRequest);
      localStorage.setItem('printQueue', JSON.stringify(existingQueue));
      
      toast({
        title: "Order Sent to Print Queue",
        description: "Your photos have been sent to the print queue for processing.",
      });
      
      setShowBill(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading checkout...</h2>
        </div>
      </div>
    );
  }

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
                  Preview of your edited photos (showing edited versions)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {orderData.photos.map((photo: any, index: number) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                        #{index + 1}
                      </div>
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
                    <span>Photos ({orderData.photoCount})</span>
                    <span>₹{orderData.photoCount * 85}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Editing</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Tax</span>
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

        {/* Bill Modal */}
        {showBill && (
          <Bill
            isOpen={showBill}
            onClose={() => setShowBill(false)}
            orderData={orderData}
            onPrint={handlePrintBill}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
