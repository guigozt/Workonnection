import React from 'react';

import styles from './Feedbacks.module.css';

export const Feedbacks: React.FC = () => {
  return (
    <section className={styles.section}>

      <div className={styles.header}>
        <h6>Feedbacks</h6>
      </div>

      <div className={styles.lista}>

        <div className={styles.card}>

          <img
            src="/imagens/FotosPerfis/Tech-Soluciones.png"
            alt="Tech4All"
            className={styles.avatar}
          />

          <div>
            <h6>Tech4All</h6>

            <p>
              "Demonstrou excelente capacidade de organização
              e liderança durante nosso processo seletivo."
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};