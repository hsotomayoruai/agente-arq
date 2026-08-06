import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import styles from './QrScanner.module.css';

export default function QrScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scannerId = 'qr-reader';
    const html5Qrcode = new Html5Qrcode(scannerId);
    scannerRef.current = html5Qrcode;

    html5Qrcode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 280 } },
        (decodedText) => {
          html5Qrcode.stop().catch(() => {});
          onScan(decodedText);
        },
        () => {}
      )
      .catch((err) => {
        setError('No se pudo acceder a la cámara. ' + err);
      });

    return () => {
      html5Qrcode.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Escanear Código QR</h2>
        <p className={styles.subtitle}>
          Apunta la cámara al código QR del cliente
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <div id="qr-reader" className={styles.reader} />
        <button className={styles.cancelBtn} onClick={onClose}>
          Continuar sin cuenta
        </button>
      </div>
    </div>
  );
}
