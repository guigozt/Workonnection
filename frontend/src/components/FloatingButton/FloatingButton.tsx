import styles from './FloatingButton.module.css';

interface FloatingButtonProps {
    onClick: () => void;
    icon?: string;
    title?: string;
}

export const FloatingButton = ({ onClick, icon = 'fas fa-plus', title = 'Nova Publicação' }: FloatingButtonProps) => {
    return (
        <button className={styles.btnPublicar} onClick={onClick} title={title} type="button">
            <i className={icon}></i>
        </button>
    );
};
