import { useRef, useState, useEffect } from 'react';
import styles from './CameraCapture.module.css';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const previewUrlRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function setPreviewUrl(url) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;
    setPreview(url);
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `residuo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        stopCamera();
        onCapture(file, url);
      },
      'image/jpeg',
      0.9
    );
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onCapture(file, url);
  }

  function retake() {
    setPreviewUrl(null);
    startCamera();
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      {!cameraActive && !preview && (
        <div className={styles.startPanel}>
          <div className={styles.cameraIcon}>📷</div>
          <p className={styles.hint}>Fotografía el residuo para identificarlo</p>
          <button className={styles.primaryBtn} onClick={startCamera}>
            Abrir Cámara
          </button>
          <p className={styles.orText}>— o —</p>
          <label className={styles.fileLabel}>
            Seleccionar Imagen
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileInput}
            />
          </label>
        </div>
      )}

      {cameraActive && (
        <div className={styles.videoWrapper}>
          <video ref={videoRef} autoPlay playsInline className={styles.video} />
          <div className={styles.videoControls}>
            <button className={styles.captureBtn} onClick={capturePhoto} title="Capturar">
              ⬤
            </button>
            <button className={styles.cancelBtn} onClick={stopCamera}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className={styles.previewWrapper}>
          <img src={preview} alt="Preview residuo" className={styles.preview} />
          <button className={styles.retakeBtn} onClick={retake}>
            📷 Tomar otra foto
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
    </div>
  );
}
