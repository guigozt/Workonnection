import { MapPin, Phone } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { Topbar } from '../../components/Topbar/Topbar';
import { obterTraducoes } from '../../utils/i18n';

import styles from './Sobre.module.css';

import hugoImg from "../../assets/photoMembers/Hugo.jpeg";
import pauloImg from "../../assets/photoMembers/Paulo.jpeg";
import guilhermeImg from "../../assets/photoMembers/Guilherme.jpeg";
import gabrielImg from "../../assets/photoMembers/gabriel.jpg";
import priscilaImg from "../../assets/photoMembers/Priscila.jpeg"
import carolineImg from "../../assets/photoMembers/Caroline.jpeg"

function Sobre() {
    const t = obterTraducoes();

    const cards = [
        {
            titulo: t.sobreRapidoTitulo,
            descricao: t.sobreRapidoDesc,
            imagem:
                'https://tse1.explicit.bing.net/th/id/OIP.CZ8GbxzrGZ7Y9nkB1fnmSAHaE7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
        },
        {
            titulo: t.sobreAutonomosTitulo,
            descricao: t.sobreAutonomosDesc,
            imagem:
                'https://tse4.mm.bing.net/th/id/OIP.u0-Xyv8WNpc3SDSbZuvKEwHaE7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
        },
        {
            titulo: t.sobreMeiTitulo,
            descricao: t.sobreMeiDesc,
            imagem:
                'https://tse1.mm.bing.net/th/id/OIP.k1327HTjhDW4O1wxZxw5CgHaEv?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
        },
    ];

    const desenvolvedores = [
        {
            nome: 'Hugo Oliveira',
            imagem: hugoImg,
            github: 'https://github.com/Hugo-Oliveira9',
        },
        {
            nome: 'Paulo Roberto',
            imagem: pauloImg,
            github: 'https://github.com/PauloElias07',
        },
        {
            nome: 'Guilherme Gomes',
            imagem: guilhermeImg,
            github: 'https://github.com/guigozt',
        },
        {
            nome: 'Gabriel Gutierres',
            imagem: gabrielImg,
            github: 'https://github.com/GabrielDaSilvaGutierres',
        },
        {
            nome: 'Priscila Mendes',
            imagem: priscilaImg,
            github: 'https://github.com/Priscilamendes18',
        },
        {
            nome: 'Carolina Mendes',
            imagem: carolineImg,
            github: 'https://github.com/carolinecarvalho06',
        },
    ];

    return (
        <div>
            <Topbar />

            <main className={styles.sobreWrapper}>

                {/* Seção principal */}
                <section className={styles.mainSection}>

                    <h3 className={styles.sobreTitulo}>
                        {t.sobreTitulo}
                    </h3>

                    <p className={styles.sobreSubtitulo}>
                        {t.sobreSubtitulo}
                    </p>

                    <div className={styles.cardsInfo}>

                        {cards.map((card) => (
                            <div
                                className={styles.cardInfo}
                                key={card.titulo}
                            >
                                <img
                                    src={card.imagem}
                                    alt={card.titulo}
                                />

                                <h5>{card.titulo}</h5>

                                <p>{card.descricao}</p>
                            </div>
                        ))}

                    </div>

                </section>

                {/* Seção dos desenvolvedores */}
                <section className={styles.teamSection}>

                    <h4 className={styles.sobreTituloSecundario}>
                        {t.sobreSecaoDevs}
                    </h4>

                    <div className={styles.teamMembers}>

                        {desenvolvedores.map((dev) => (
                            <div
                                className={styles.teamMember}
                                key={dev.github}
                            >
                                <img
                                    src={dev.imagem}
                                    alt={dev.nome}
                                />

                                <h6>{dev.nome}</h6>

                                <a
                                    href={dev.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaGithub size={20} />
                                    GitHub
                                </a>
                            </div>
                        ))}

                    </div>

                </section>

                {/* Footer */}
                <footer className={styles.footerWc}>

                    <p>
                        © 2025 | WorkConnection - Todos os direitos reservados.
                    </p>

                    <p>
                        Projeto Integrador da Fatec Diadema
                    </p>

                    <div className={styles.footerInfo}>

                        <span>
                            <MapPin size={16} />
                            Av. Luiz Merenda 443, Diadema, SP
                        </span>

                        <span>
                            <Phone size={16} />
                            (11) 4093-9712
                        </span>

                    </div>

                    <p>
                        Site:{' '}

                        <a
                            href="https://fatecdiadema.cps.sp.gov.br/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.fatecdiadema.cps.sp.gov.br
                        </a>
                    </p>

                </footer>

            </main>
        </div>
    );
}

export default Sobre;