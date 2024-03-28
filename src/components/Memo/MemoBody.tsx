import styles from './MemoBody.module.css'

export function MemoBody({ children }) {
  return <div className={styles.root}>{children}</div>
}
