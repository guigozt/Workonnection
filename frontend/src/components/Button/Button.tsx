import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: string;
    isLoading?: boolean;
}

export const Button = ({ children, icon, isLoading, ...props }: ButtonProps ) => {
    return (
        <button
            className={`${styles.btnPrimary} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
                icon && <i className={`${icon}`}></i>
            )}
            {children}
        </button>
    )
}
