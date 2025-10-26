"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { testSimplePDF } from "@/utils/simple-pdf-test";

const SimpleTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      console.log("=== Testing Simple PDF ===");
      await testSimplePDF('test-content');
      console.log("=== Test completed ===");
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Simple PDF Test</h2>
      
      {/* Test content */}
      <div 
        id="test-content" 
        className="bg-white border-2 border-black p-8 text-center"
        style={{
          width: '400px',
          height: '300px',
          backgroundColor: '#f0f0f0',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <h1 className="text-2xl font-bold text-black mb-4">TEST CERTIFICATE</h1>
        <p className="text-lg text-black">This is a test certificate</p>
        <p className="text-sm text-gray-600 mt-4">Certificate ID: TEST-123</p>
        <div className="mt-4">
          <div className="w-32 h-16 border border-black mx-auto"></div>
          <p className="text-xs mt-2">Signature</p>
        </div>
      </div>

      <Button 
        onClick={handleTest} 
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? "Testing..." : "Test PDF Generation"}
      </Button>
    </div>
  );
};

export default SimpleTest;
