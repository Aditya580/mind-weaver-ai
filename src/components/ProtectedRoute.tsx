import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'auth' | 'noauth'>('loading');

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setStatus(session ? 'auth' : 'noauth');
    });
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'auth' : 'noauth');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (status === 'noauth') return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
