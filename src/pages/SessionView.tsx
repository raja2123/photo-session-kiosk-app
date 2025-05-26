
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SessionView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate pin verification (demo pin: 1234)
      if (pin === '1234') {
        toast({
          title: "Access Granted",
          description: "Welcome to the session!",
        });
        navigate(`/user/session/${sessionId}/photos`);
      } else {
        toast({
          title: "Invalid PIN",
          description: "Please enter the correct 4-digit PIN.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/user">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-indigo-700 font-bold">
              Session Access
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Session: <span className="font-semibold text-indigo-600">{sessionId}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-gray-700 text-lg">Enter 4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  required
                  className="border-gray-300 focus:border-indigo-500 text-center text-3xl tracking-[1rem] font-bold h-16 bg-white/90"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading || pin.length !== 4}
              >
                {loading ? 'Verifying...' : 'Access Session'}
              </Button>
            </form>

            {/* Demo PIN Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Demo PIN:</p>
              <p className="text-xs text-blue-600">PIN: 1234</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionView;
