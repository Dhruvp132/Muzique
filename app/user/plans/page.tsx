"use client";
/* eslint-disable react/no-unescaped-entities */
// import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Check } from 'lucide-react';
import { useAmount } from '@/app/contexts/AmountContext';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

export default function Plans() {
  const { setAmount } = useAmount();
  // const [songInput, setSongInput] = useState('');
  const router = useRouter(); // Initialize the router

  const plans = [
    { name: 'Basic', price: 5, songs: 2, color: 'via-purple-700' },
    { name: 'Standard', price: 10, songs: 5, color: 'via-purple-800' },
    { name: 'Premium', price: 15, songs: 'Whole Playlist', color: 'via-purple-900' },
  ];

  const handleSubmit = (price: number) => {
    setAmount(price); // Set the amount based on the clicked plan
    router.push('/user/payments'); // Navigate to the payments page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">Choose Your Plan</h1>
        <p className="text-xl text-center mb-12 text-gray-300">Add songs to any creator's stream</p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          {/* <input
            type="text"
            value={songInput}
            onChange={(e) => setSongInput(e.target.value)}
            placeholder="Enter song name..."
            className="w-full max-w-md px-4 py-2 rounded-l-lg bg-gray-800 text-white border-2 border-purple-600 focus:outline-none focus:border-purple-400"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300">
            Add Song
          </button> */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br from-gray-800 ${plan.color} to-gray-900 rounded-lg shadow-xl overflow-hidden`}
            >
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-center mb-4">{plan.name}</h2>
                <p className="text-4xl font-extrabold text-center mb-6">${plan.price}</p>
                <ul className="text-sm mb-8">
                  <li className="flex items-center mb-3">
                    <Check className="h-5 w-5 mr-2 text-purple-400" />
                    {typeof plan.songs === 'number' ? `${plan.songs} songs` : plan.songs}
                  </li>
                  <li className="flex items-center mb-3">
                    <Check className="h-5 w-5 mr-2 text-purple-400" />
                    Add to any creator's stream
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-purple-400" />
                    24/7 support
                  </li>
                </ul>
                <button
                  onClick={() => handleSubmit(plan.price)} // Pass the price to the handler
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Choose Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Music className="h-16 w-16 mx-auto text-purple-400 mb-4" />
          <p className="text-xl font-semibold">Start adding your favorite songs today!</p>
        </motion.div>
      </div>
    </div>
  );
}
