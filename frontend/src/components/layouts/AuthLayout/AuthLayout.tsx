import type { ReactNode } from "react";
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: ReactNode;
    imageSrc: string;
    imageAlt: string;
}

export const AuthLayout = ({ children, imageSrc, imageAlt }: AuthLayoutProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <img src={imageSrc} alt={imageAlt} />
            </div>

            <div className={styles.right}>
                <div className={styles.formBox}>
                    <img 
                        src="/logo_workonnection.png"
                        className={styles.logo} 
                        alt="Logo Workonnection" 
                    />
                    {children}
                </div>
            </div>
        </div>
    )
}
