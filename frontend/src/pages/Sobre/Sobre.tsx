import { MapPin, Phone } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { Topbar } from '../../components/Topbar/Topbar';

import styles from './Sobre.module.css';

import hugoImg from "../../assets/photoMembers/Hugo.jpeg";
import pauloImg from "../../assets/photoMembers/Paulo.jpeg";
import guilhermeImg from "../../assets/photoMembers/Guilherme.jpeg";
import gabrielImg from "../../assets/photoMembers/gabriel.jpg";
import priscilaImg from "../../assets/photoMembers/Priscila.jpeg"
import carolineImg from "../../assets/photoMembers/Caroline.jpeg"

const cards = [
    {
        titulo: 'Rápido e Simples',
        descricao:
            'Encontre novos trabalhos em minutos. Cadastre-se, crie seu perfil e comece a receber propostas. Rápido, simples e direto ao ponto.',
        imagem:
            'https://tse1.explicit.bing.net/th/id/OIP.CZ8GbxzrGZ7Y9nkB1fnmSAHaE7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
        titulo: 'Para Autônomos',
        descricao:
            'Você trabalha por conta? A gente te conecta com clientes de verdade. Mostre suas habilidades e conquiste projetos que pagam.',
        imagem:
            'https://tse4.mm.bing.net/th/id/OIP.u0-Xyv8WNpc3SDSbZuvKEwHaE7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
        titulo: 'MEIs para MEIs',
        descricao:
            'De microempreendedor para microempreendedor: aqui você se conecta com quem também faz acontecer. Negocie entre MEIs, com segurança e facilidade.',
        imagem:
            'https://tse1.mm.bing.net/th/id/OIP.k1327HTjhDW4O1wxZxw5CgHaEv?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
];

const desenvolvedores = [
    {
        nome: 'Hugo Oliveira',
        imagem:
            hugoImg,
        github: 'https://github.com/Hugo-Oliveira9',
    },
    {
        nome: 'Paulo Roberto',
        imagem:
            pauloImg,
        github: 'https://github.com/PauloElias07',
    },
    {
        nome: 'Guilherme Gomes',
        imagem:
            guilhermeImg,
        github: 'https://github.com/guigozt',
    },
    {
        nome: 'Gabriel Gutierres',
        imagem:
            gabrielImg,
        github: 'https://github.com/GabrielDaSilvaGutierres',
    },
    {
        nome: 'Priscila Mendes',
        imagem:
            priscilaImg,
        github: 'https://github.com/Priscilamendes18',
    },
    {
        nome: 'Carolina Mendes',
        imagem:
            carolineImg,
        github: 'https://github.com/carolinecarvalho06',
    },
];

function Sobre() {
    return (
    <div>
        <Topbar notificacoesNaoLidas={3} />

        <main className={styles.sobreWrapper}>

            {/* Seção principal */}
            <section className={styles.mainSection}>

                <h3 className={styles.sobreTitulo}>
                    O que você está procurando?
                </h3>

                <p className={styles.sobreSubtitulo}>
                    Somos uma plataforma inovadora que busca simplificar e
                    tornar o processo seletivo algo mais rápido e menos
                    burocrático. Nunca foi tão simples encontrar a vaga
                    perfeita para você.
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
                    Desenvolvedores do Projeto
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