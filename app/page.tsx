"use client";

import { useState, ChangeEvent } from 'react';
import { predictImage, classifyImage } from '@/api'; // Ensure both are exported from api.js

export default function SplitPredictor() {
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputPreview, setOutputPreview] = useState<string | null>(null);
  // State to store classification results
  const [classification, setClassification] = useState<{ classe: string, probabilidade: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInputPreview(URL.createObjectURL(file));
    setOutputPreview(null);
    setClassification(null); // Reset previous classification
    setLoading(true);

    try {
      // Run both requests in parallel for better performance
      const [imageBlob, classResult] = await Promise.all([
        predictImage(file),
        classifyImage(file)
      ]);

      setOutputPreview(URL.createObjectURL(imageBlob));
      setClassification(classResult);
    } catch (error) {
      console.error(error);
      alert("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 p-4">
      <h1 className="text-2xl text-orange-400 font-bold text-center mb-4">Pix2Pix Generator</h1>

      <div className="flex-1 flex w-full">

        {/* Left Section (Input) */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-white">Input</h3>
          <div className="w-120 h-120 border-2 border-dashed border-orange-400 bg-gray-800 flex items-center justify-center overflow-hidden rounded-lg relative">
            {inputPreview ? (
              <img src={inputPreview} alt="Input" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white hover:text-orange-400 transition-colors">
                <span className="text-xl font-bold">+</span>
                <span>Click to Upload</span>
                <input type="file" onChange={handleUpload} accept="image/*" className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Right Section (Output + Classification) */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4 text-white">Output</h3>

          <div className="w-120 h-120 border-2 border-dashed border-orange-400 bg-gray-800 flex items-center justify-center overflow-hidden rounded-lg">
            {loading ? (
              <span className="animate-pulse text-orange-400">Processing...</span>
            ) : outputPreview ? (
              <img src={outputPreview} alt="Output" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Waiting for input...</span>
            )}
          </div>

          {/* Classification Results Display */}
          {!loading && classification && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800 text-center min-w-[300px]">
              <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Classification</h4>
              <p className="text-2xl text-white font-bold mb-1">
                {classification.classe}
              </p>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-orange-400 h-full transition-all duration-500"
                  style={{ width: `${classification.probabilidade * 100}%` }}
                />
              </div>
              <p className="text-orange-400 text-sm mt-2">
                {(classification.probabilidade * 100).toFixed(1)}% Confidence
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
