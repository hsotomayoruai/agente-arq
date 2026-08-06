import styles from './PointsBadge.module.css';

export default function PointsBadge({ customer, pointsAwarded }) {
  if (!customer) return null;
  return (
    <div className={styles.badge}>
      <div className={styles.greeting}>¡Hola, {customer.name}!</div>
      {pointsAwarded > 0 && (
        <div className={styles.earned}>
          <span className={styles.plus}>+{pointsAwarded}</span> puntos ganados 🎉
        </div>
      )}
      <div className={styles.total}>
        Total: <strong>{customer.points}</strong> pts
      </div>
    </div>
  );
}
