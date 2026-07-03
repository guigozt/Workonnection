import type { InputHTMLAttributes } from 'react';
import styles from './InputGroup.module.css'; // Aponta para o nome novo

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  errorMessage?: string;
  isSuccess?: boolean;
}

export const InputGroup = ({ icon, errorMessage, isSuccess, ...props }: InputGroupProps) => {
  const inputClass = errorMessage 
    ? styles.error 
    : isSuccess 
      ? styles.success 
      : '';

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputWrapper}>
        <input className={inputClass} {...props} />
        <i className={`${icon} ${styles.inputIcon}`}></i>
      </div>
      {errorMessage && <small className={styles.errorMessage}>{errorMessage}</small>}
    </div>
  );
};