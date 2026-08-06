import styles from './ContainerDisplay.module.css';

const CONTAINER_STYLES = {
  yellow:  { bg: '#fffde7', border: '#f9c74f', text: '#7d5a00', emoji: '🟡' },
  blue:    { bg: '#e3f2fd', border: '#4fc3f7', text: '#0d47a1', emoji: '🔵' },
  green:   { bg: '#e8f5e9', border: '#66bb6a', text: '#1b5e20', emoji: '🟢' },
  gray:    { bg: '#f5f5f5', border: '#9e9e9e', text: '#424242', emoji: '⚫' },
  brown:   { bg: '#efebe9', border: '#a1887f', text: '#3e2723', emoji: '🟤' },
  orange:  { bg: '#fff3e0', border: '#ffa726', text: '#e65100', emoji: '🟠' },
  black:   { bg: '#fafafa', border: '#424242', text: '#212121', emoji: '⬛' },
};

export default function ContainerDisplay({ result }) {
  const style = CONTAINER_STYLES[result.containerColor] || CONTAINER_STYLES.black;

  return (
    <div
      className={styles.card}
      style={{ background: style.bg, borderColor: style.border }}
    >
      <div className={styles.icon}>{result.containerIcon || style.emoji}</div>
      <h2 className={styles.wasteType}>{result.wasteType}</h2>
      <div
        className={styles.containerBadge}
        style={{ background: style.border, color: style.text }}
      >
        {result.containerLabel}
      </div>
      <p className={styles.instruction}>Deposita este residuo en:</p>
      <div
        className={styles.containerBox}
        style={{ background: style.border }}
      >
        <span className={styles.containerEmoji}>{result.containerIcon || style.emoji}</span>
        <span className={styles.containerName} style={{ color: style.text }}>
          {result.containerLabel}
        </span>
      </div>
      <div className={styles.confidence}>
        Confianza: {Math.round((result.confidence || 0) * 100)}%
      </div>
    </div>
  );
}
