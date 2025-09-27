import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fish, Trophy, Target } from 'lucide-react';
import { SignatureTechniques } from '@/components/SignatureTechniques';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PersonalizedAuthRedirect } from '@/components/auth/PersonalizedAuthRedirect';

const signInSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  club: z.string().trim().max(100, 'Club name must be less than 100 characters').optional(),
  home_state: z.string().min(1, 'Home state is required'),
  city: z.string().trim().max(100, 'City must be less than 100 characters').optional(),
  signatureTechniques: z.array(z.string()).min(1, 'Please select at least 1 signature technique').max(3, 'Maximum 3 techniques allowed')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

// US States for dropdown
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [lastSignInEmail, setLastSignInEmail] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { signIn, signUp, resendConfirmation, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/dashboard';

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      club: '',
      home_state: '',
      city: '',
      signatureTechniques: []
    }
  });

  // Redirect if already authenticated - use PersonalizedAuthRedirect
  useEffect(() => {
    // Don't redirect here - let PersonalizedAuthRedirect handle it
  }, [user, loading, navigate, from]);

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setEmailNotConfirmed(false);
    setLastSignInEmail(data.email.trim());
    try {
      const { error } = await signIn(data.email.trim(), data.password, from);
      if (!error) {
        // Don't navigate here - PersonalizedAuthRedirect will handle it
      } else if ((error.message || '').toLowerCase().includes('email not confirmed')) {
        setEmailNotConfirmed(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastSignInEmail) return;
    setResendLoading(true);
    try {
      await resendConfirmation(lastSignInEmail);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, {
        name: data.name,
        club: data.club || '',
        avatar_url: '',
        signature_techniques: data.signatureTechniques,
        home_state: data.home_state,
        city: data.city || ''
      });
      
      if (!error) {
        // Stay on sign up tab to show success message
        signUpForm.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (user) {
    return (
      <PersonalizedAuthRedirect>
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <LoadingSpinner message="Redirecting to your personalized dashboard..." />
        </div>
      </PersonalizedAuthRedirect>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/15"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 text-white">
              <Fish className="w-8 h-8" />
              <Trophy className="w-8 h-8" />
              <Target className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TrophyCast</h1>
          <p className="text-white/90">Where Every Cast Counts</p>
        </div>

        <Card className="bg-card/95 backdrop-blur border-white/20">
          <CardHeader className="text-center">
            <CardTitle>Welcome to TrophyCast</CardTitle>
            <CardDescription>
              Sign in to access your tournament fishing companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                {emailNotConfirmed && (
                  <Alert>
                    <AlertDescription>
                      Please confirm your email to sign in. Didn't get it?
                      <Button variant="outline" size="sm" className="ml-2" onClick={handleResendConfirmation} disabled={resendLoading}>
                        {resendLoading ? 'Resending...' : 'Resend confirmation email'}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="club"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your fishing club"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="home_state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your home state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Town/City (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your city"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm your password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="signatureTechniques"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SignatureTechniques
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-white/70 text-sm mt-4">
          AI-powered tournament fishing companion
        </p>
      </div>
    </div>
  );
}