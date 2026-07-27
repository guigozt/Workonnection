import { InputGroup } from "../../../components/Input/InputGroup";
import { Button } from "../../../components/Button/Button";
import { useCadastro } from "./useCadastro";
import styles from "./Cadastro.module.css";

const tipoUsuarios = [
    { id: "EMPRESA", label: "Empresa", icon: "fa-solid fa-building" },
    { id: "ME", label: "ME", icon: "fa-solid fa-briedcase" },
    { id: "MEI", label: "MEI", icon: "fa-solid fa-file-invoice" },
    { id: "ESTUDANTE", label: "Estudante", icon: "fa-solid fa-user-graduate" },
];

export const Cadastro = () => {
    const {
        formData,
        errors,
        feedback,
        isSubmitting,
        handleChange,
        handleSelectTipo,
        handleSubmit,
        navigate,
    } = useCadastro();

    return (
        <div className={styles.pageContainer}>
        <header className={styles.header}>
            <img
            src="/logo_workonnection.png"
            alt="Logo Workonnection"
            className={styles.logo}
            />
            <h1>Cadastro</h1>
        </header>

        <main className={styles.cadastroContainer}>
            <section className={styles.formBox}>
            <h2>Dados Pessoais</h2>

            {feedback.message && (
                <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                {feedback.message}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.formRow}>
                <InputGroup
                    label="Nome"
                    name="nome"
                    placeholder="Seu nome completo"
                    icon="fa-solid fa-user"
                    value={formData.nome}
                    onChange={handleChange}
                    errorMessage={errors.nome}
                />
                <InputGroup
                    label="CPF"
                    name="cpf"
                    placeholder="000.000.000-00"
                    icon="fa-solid fa-id-card"
                    value={formData.cpf}
                    onChange={handleChange}
                    errorMessage={errors.cpf}
                />
                </div>

                <div className={styles.formRow}>
                <InputGroup
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    icon="fa-solid fa-calendar"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    errorMessage={errors.dataNascimento}
                />
                <InputGroup
                    label="Telefone"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    icon="fa-solid fa-phone"
                    value={formData.telefone}
                    onChange={handleChange}
                    errorMessage={errors.telefone}
                />
                </div>

                <div className={styles.formRow}>
                <InputGroup
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    icon="fa-solid fa-envelope"
                    value={formData.email}
                    onChange={handleChange}
                    errorMessage={errors.email}
                />
                <InputGroup
                    label="Senha"
                    name="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    icon="fa-solid fa-lock"
                    value={formData.senha}
                    onChange={handleChange}
                    errorMessage={errors.senha}
                />
                </div>

                <div className={styles.formRow}>
                <InputGroup
                    label="Confirmar Senha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    icon="fa-solid fa-lock"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    errorMessage={errors.confirmarSenha}
                />
                </div>

                <p className={styles.userLabel}>Tipo de Usuário</p>
                <div className={styles.userTypeBox}>
                {tipoUsuarios.map((tipo) => (
                    <button
                    key={tipo.id}
                    type="button"
                    className={`${styles.userBtn} ${formData.tipoUsuario === tipo.id ? styles.ativo : ""}`}
                    onClick={() => handleSelectTipo(tipo.id)}
                    >
                    <i className={tipo.icon} /> {tipo.label}
                    </button>
                ))}
                </div>
                {errors.tipoUsuario && (
                <small className={styles.typeError}>{errors.tipoUsuario}</small>
                )}

                <div className={styles.buttons}>
                <button
                    type="button"
                    className={styles.btnBack}
                    onClick={() => navigate("/login")}
                >
                    <i className="fa-solid fa-arrow-left" /> Voltar
                </button>

                <Button
                    type="submit"
                    icon="fa-solid fa-user-plus"
                    isLoading={isSubmitting}
                >
                    Cadastrar
                </Button>
                </div>
            </form>
            </section>
        </main>
        </div>
    );
};
