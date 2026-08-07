import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

export default function QRScanner({ onScan, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        scanFrame();
      }
    } catch (err) {
      const code = err.name === 'NotAllowedError' ? 'CAMERA_PERMISSION_DENIED' : 'CAMERA_UNAVAILABLE';
      const message = code === 'CAMERA_PERMISSION_DENIED'
        ? 'Permiso de cámara denegado.'
        : 'Cámara no disponible.';
      setCameraError({ code, message });
      if (onError) onError({ code, message });
    }
  }

  function stopCamera() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  }

  function scanFrame() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        stopCamera();
        if (onScan) onScan(code.data);
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }

  if (cameraError) {
    return (
      <div data-testid="qr-scanner-error" style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ color: '#c62828' }}>{cameraError.message}</p>
        <p style={{ color: '#757575', fontSize: '0.9rem', marginTop: 8 }}>
          Ingresa tu código QR manualmente si es posible.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="qr-scanner" style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <video
        ref={videoRef}
        style={{ width: '100%', borderRadius: 12, background: '#000' }}
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {scanning && (
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid #4caf50',
          borderRadius: 12,
          pointerEvents: 'none'
        }} />
      )}
      <p style={{ textAlign: 'center', marginTop: 12, color: '#2e7d32', fontSize: '0.9rem' }}>
        Apunta la cámara al código QR
      </p>
    </div>
  );
}
