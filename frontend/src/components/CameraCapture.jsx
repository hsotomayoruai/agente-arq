import React, { useRef, useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CameraCapture({ onCapture, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [preview, setPreview] = useState(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      const code = err.name === 'NotAllowedError' ? 'CAMERA_PERMISSION_DENIED' : 'CAMERA_UNAVAILABLE';
      setCameraError(code);
      if (onError) onError({ code });
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    stopCamera();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setPreview(url);
        if (onCapture) onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      if (onError) onError({ code: 'INVALID_FORMAT', message: 'Formato no soportado. Use JPEG, PNG o WEBP.' });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (onError) onError({ code: 'FILE_TOO_LARGE', message: 'Archivo demasiado grande. Máximo 5MB.' });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    if (onCapture) onCapture(file);
  }

  function resetCapture() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  if (preview) {
    return (
      <div data-testid="capture-preview" style={{ textAlign: 'center' }}>
        <img
          src={preview}
          alt="Vista previa"
          style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 12, marginBottom: 16 }}
        />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={resetCapture}
            style={{
              background: '#f5f5f5',
              border: '1px solid #bdbdbd',
              borderRadius: 10,
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            🔄 Cambiar imagen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="camera-capture" style={{ textAlign: 'center' }}>
      {cameraActive ? (
        <div>
          <video
            ref={videoRef}
            style={{ width: '100%', maxWidth: 400, borderRadius: 12 }}
            playsInline
            muted
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            <button
              onClick={capturePhoto}
              style={{
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '12px 28px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              📸 Capturar
            </button>
            <button
              onClick={stopCamera}
              style={{
                background: '#f5f5f5',
                border: '1px solid #bdbdbd',
                borderRadius: 10,
                padding: '12px 20px',
                cursor: 'pointer'
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          {cameraError && (
            <p style={{ color: '#c62828', fontSize: '0.9rem' }}>
              {cameraError === 'CAMERA_PERMISSION_DENIED'
                ? 'Permiso de cámara denegado.'
                : 'Cámara no disponible.'}
            </p>
          )}

          <button
            onClick={startCamera}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '16px 32px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              maxWidth: 300
            }}
          >
            📷 Usar cámara
          </button>

          <p style={{ color: '#757575', fontSize: '0.9rem' }}>— o —</p>

          <label style={{ width: '100%', maxWidth: 300 }}>
            <div style={{
              background: '#e8f5e9',
              border: '2px solid #4caf50',
              borderRadius: 12,
              padding: '16px 32px',
              fontSize: '1rem',
              cursor: 'pointer',
              textAlign: 'center',
              color: '#2e7d32',
              fontWeight: 600
            }}>
              📁 Seleccionar imagen
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              data-testid="file-input"
            />
          </label>
        </div>
      )}
    </div>
  );
}
