/* global cv */

class FaceDetectionService {
  constructor() {
    this.isModelLoaded = false;
    this.faceCascade = null;
  }

  async loadModels() {
    try {
      console.log('Loading face detection models...');
      
      // Load the face detection model
      this.faceCascade = new cv.CascadeClassifier();
      const modelFile = '/models/haarcascade_frontalface_default.xml';
      const modelData = await fetch(modelFile).then(res => res.arrayBuffer());
      this.faceCascade.load(new Uint8Array(modelData));
      
      this.isModelLoaded = true;
      console.log('Face detection model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading face detection model:', error);
      return false;
    }
  }

  detectFaces(video) {
    if (!this.isModelLoaded || !video.videoWidth) {
      return [];
    }

    try {
      const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
      const gray = new cv.Mat();
      const cap = new cv.VideoCapture(video);
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

      const faces = new cv.RectVector();
      const msize = new cv.Size(0, 0);
      this.faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

      const detections = [];
      for (let i = 0; i < faces.size(); ++i) {
        const face = faces.get(i);
        detections.push({
          x: face.x,
          y: face.y,
          width: face.width,
          height: face.height
        });
      }

      src.delete();
      gray.delete();
      faces.delete();

      return detections;
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  }

  drawDetections(canvasCtx, detections) {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    detections.forEach(detection => {
      canvasCtx.beginPath();
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = '#00ff00';
      canvasCtx.rect(detection.x, detection.y, detection.width, detection.height);
      canvasCtx.stroke();
    });
  }
}

export default new FaceDetectionService();
