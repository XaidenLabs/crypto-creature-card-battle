
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container py-24 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-blue to-game-purple mb-4 animate-fade-in">
            404
          </div>
          <h1 className="text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            We couldn't find the page you're looking for.
          </p>
          <Button 
            asChild
            className="animate-scale-in btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple"
            style={{ animationDelay: '0.6s' }}
          >
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
