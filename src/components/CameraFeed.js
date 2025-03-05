import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const CameraFeed = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const [stream, setStream] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 1280, height: 720 });
  const frameCountRef = useRef(0);
  const animationFrameRef = useRef();

  // Move all function definitions outside of other functions
  const setupGPU = async () => {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('GPU Acceleration enabled:', tf.getBackend());
  };

  const loadFaceDetectionModels = async () => {
    const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL)
      ]);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const detectFace = async () => {
    if (!isVideoReady || !videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectFace);
      return;
    }

    try {
      if (frameCountRef.current % 2 === 0) {
        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320,
          scoreThreshold: 0.5
        });

        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks(true);

        if (detections && detections.length > 0) {
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };

          canvasRef.current.width = displaySize.width;
          canvasRef.current.height = displaySize.height;

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, displaySize.width, displaySize.height);
          
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }
      }
      frameCountRef.current++;
    } catch (error) {
      console.error('Error in face detection:', error);
    }

    animationFrameRef.current = requestAnimationFrame(detectFace);
  };

  const stopDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const stopCamera = () => {
    stopDetection(); // Stop detection first
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
    setVideoSize({ width: 0, height: 0 });

    // Clear the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const startCamera = async () => {
    try {
      await setupGPU();
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setStream(newStream);
        await loadFaceDetectionModels();
        setIsVideoReady(true);
        detectFace(); // Start detection only after camera is ready
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const toggleCamera = async () => {
    if (isEnabled) {
      stopCamera();
    } else {
      await startCamera();
    }
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    if (isEnabled) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, []); // Only run on mount and unmount

  return (
    <div className="camera-container">
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted 
        className="camera-feed"
      />
      <canvas ref={canvasRef} className="face-detection-canvas" />
      {!isEnabled && (
        <div className="camera-off-placeholder">
          Camera is turned off
        </div>
      )}
      <button 
        onClick={toggleCamera} 
        className={`camera-toggle ${isEnabled ? 'on' : 'off'}`}
      >
        {isEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
    </div>
  );
};

export default CameraFeed;
