import * as faceapi from 'face-api.js';

self.onmessage = async (e) => {
  const { imageData, options } = e.data;
  
  try {
    const detections = await faceapi
      .detectAllFaces(imageData, new faceapi.TinyFaceDetectorOptions(options))
      .withFaceLandmarks(true);
    
    self.postMessage({ detections });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
