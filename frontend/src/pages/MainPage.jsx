import { useState, useCallback } from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { useClassification } from '../hooks/useClassification';
import QrScanner from '../components/QrScanner';
import CameraCapture from '../components/CameraCapture';
import ContainerDisplay from '../components/ContainerDisplay';
import PointsBadge from '../components/PointsBadge';
import styles from './MainPage.module.css';

const STEP = {
  IDENTIFY: 'IDENTIFY',
  CAPTURE: 'CAPTURE',
  CLASSIFYING: 'CLASSIFYING',
  RESULT: 'RESULT',
};

export default function MainPage() {
  const [step, setStep] = useState(STEP.IDENTIFY);
  const [showQr, setShowQr] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { customer, loading: custLoading, error: custError, loginByQr, logout } = useCustomer();
  const { result, loading: classLoading, error: classError, classify, reset } = useClassification();

  const handleQrScan = useCallback(
    async (qrCode) => {
      setShowQr(false);
      await loginByQr(qrCode);
      setStep(STEP.CAPTURE);
    },
    [loginByQr]
  );

  const handleSkipLogin = useCallback(() => {
    setShowQr(false);
    setStep(STEP.CAPTURE);
  }, []);

  const handleCapture = useCallback(
    async (file, previewUrl) => {
      setImagePreview(previewUrl);
      setStep(STEP.CLASSIFYING);
      const res = await classify(file, customer?.id);
      if (res) {
        setStep(STEP.RESULT);
      } else {
        setStep(STEP.CAPTURE);
      }
    },
    [classify, customer]
  );

  const handleReset = useCallback(() => {
    reset();
    setImagePreview(null);
    setStep(STEP.CAPTURE);
  }, [reset]);

  const handleNewSession = useCallback(() => {
    reset();
    setImagePreview(null);
    logout();
    setStep(STEP.IDENTIFY);
  }, [reset, logout]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>♻️ ReciclApp</div>
        {customer && (
          <div className={styles.headerUser}>
            <span>👤 {customer.name}</span>
            <span className={styles.pts}>{customer.points} pts</span>
          </div>
        )}
      </header>

      {/* QR Scanner Modal */}
      {showQr && (
        <QrScanner onScan={handleQrScan} onClose={handleSkipLogin} />
      )}

      <main className={styles.main}>
        {/* STEP: IDENTIFY */}
        {step === STEP.IDENTIFY && (
          <div className={styles.identifyPanel}>
            <div className={styles.welcomeIcon}>♻️</div>
            <h1 className={styles.welcomeTitle}>Bienvenido a ReciclApp</h1>
            <p className={styles.welcomeText}>
              Identifica tus residuos y aprende dónde depositarlos correctamente.
            </p>
            {custError && <p className={styles.errorMsg}>{custError}</p>}
            <button
              className={styles.primaryBtn}
              onClick={() => setShowQr(true)}
              disabled={custLoading}
            >
              {custLoading ? 'Buscando...' : '📷 Escanear QR de cliente'}
            </button>
            <button className={styles.secondaryBtn} onClick={handleSkipLogin}>
              Continuar sin cuenta
            </button>
          </div>
        )}

        {/* STEP: CAPTURE */}
        {step === STEP.CAPTURE && (
          <div className={styles.capturePanel}>
            <h2 className={styles.sectionTitle}>Fotografiar Residuo</h2>
            {customer && (
              <PointsBadge customer={customer} pointsAwarded={0} />
            )}
            <CameraCapture onCapture={handleCapture} />
            {classError && <p className={styles.errorMsg}>{classError}</p>}
          </div>
        )}

        {/* STEP: CLASSIFYING */}
        {step === STEP.CLASSIFYING && (
          <div className={styles.classifyingPanel}>
            {imagePreview && (
              <img src={imagePreview} alt="Residuo" className={styles.previewThumb} />
            )}
            <div className={styles.spinner} />
            <p className={styles.classifyingText}>Identificando residuo...</p>
          </div>
        )}

        {/* STEP: RESULT */}
        {step === STEP.RESULT && result && (
          <div className={styles.resultPanel}>
            {imagePreview && (
              <img src={imagePreview} alt="Residuo" className={styles.previewThumb} />
            )}
            <ContainerDisplay result={result} />
            {result.customer && (
              <PointsBadge
                customer={result.customer}
                pointsAwarded={result.pointsAwarded}
              />
            )}
            <div className={styles.resultActions}>
              <button className={styles.primaryBtn} onClick={handleReset}>
                📷 Clasificar otro residuo
              </button>
              <button className={styles.secondaryBtn} onClick={handleNewSession}>
                🔄 Nueva sesión
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
