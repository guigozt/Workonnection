import type { InputHTMLAttributes } from 'react';
import styles from './InputGroup.module.css'; // Aponta para o nome novo

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon: string;
  errorMessage?: string;
  isSuccess?: boolean;
}

export const InputGroup = ({ label, icon, errorMessage, isSuccess, id, name, ...props }: InputGroupProps) => {
  const inputId = id || name;
  const inputClass = errorMessage 
    ? styles.error 
    : isSuccess 
      ? styles.success 
      : '';

  return (
    <div className={styles.inputGroup}>
      {label && <label htmlFor={inputId}>{label}</label>}

      <div className={styles.inputWrapper}>
        <i className={`${icon} ${styles.inputIcon}`}></i>
        <input
          id={inputId}
          name={name}
          className={inputClass} 
          {...props}
        />
      </div>
      
      {errorMessage && <small className={styles.errorMessage}>{errorMessage}</small>}
    </div>
  );
};