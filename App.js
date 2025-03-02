import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-stripe-public-key-here");

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
      <motion.h1 
        className="text-4xl font-bold mb-6" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}>
        Welcome to Our Gaming Community
      </motion.h1>
      
      <Card className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-xl">
        <CardContent className="p-6 flex flex-col items-center">
          <p className="text-lg text-gray-300 mb-4 text-center">
            Join a community of gamers, analyze your gameplay, and connect with other players!
          </p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl">
            Get Started
          </Button>
          <Link to="/store" className="mt-4 text-blue-400 hover:underline">Visit Our Store</Link>
        </CardContent>
      </Card>
    </div>
  );
}

function Store() {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("/create-checkout-session", { method: "POST" });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
      <motion.h1 
        className="text-4xl font-bold mb-6" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}>
        Store
      </motion.h1>
      <Card className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl">
        <CardContent className="p-6 flex flex-col items-center">
          <p className="text-lg text-gray-300 mb-4 text-center">
            Exclusive gaming merchandise available now!
          </p>
          <Button onClick={handleCheckout} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl">
            Buy Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}
