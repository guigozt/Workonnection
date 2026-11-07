import React, { useState, useRef, useEffect } from "react";
import { Button } from "../Button/Button";
import { useAuth } from "../../context/useAuth";
import styles from "./ModalVerificacaoEmail.module.css";

interface ModalVerificacaoEmailProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  definirSenha?: boolean;
  senhaDigitada?: string;
}

export const ModalVerificacaoEmail: React.FC<ModalVerificacaoEmailProps> = ({
  email,
  isOpen,
  onClose,
  onSuccess,
  definirSenha = false,
  senhaDigitada = "",
}) => {
  const { verificarCodigo, reenviarCodigo } = useAuth();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleClose = () => {
    setDigits(["", "", "", "", "", ""]);
    setErro(null);
    setSucesso(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...digits];
      updated[index] = "";
      setDigits(updated);
      return;
    }

    const updated = [...digits];
    if (cleaned.length === 1) {
      updated[index] = cleaned;
      setDigits(updated);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      // Suporte a colar código completo
      const chars = cleaned.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        updated[i] = chars[i] || "";
      }
      setDigits(updated);
      const nextIdx = Math.min(chars.length, 5);
      inputsRef.current[nextIdx]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = digits.join("");
    if (codigo.length !== 6) {
      setErro("Por favor, digite os 6 dígitos do código recebido.");
      return;
    }

    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      await verificarCodigo({
        email,
        codigo,
        novaSenha: definirSenha && senhaDigitada ? senhaDigitada : undefined,
      });
      setSucesso(
        definirSenha
          ? "Identidade confirmada e senha cadastrada com sucesso!"
          : "E-mail confirmado com sucesso!"
      );
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } | string }; message?: string };
      const serverMsg =
        typeof errorObj?.response?.data === "string"
          ? errorObj.response.data
          : errorObj?.response?.data?.message;
      setErro(serverMsg || errorObj?.message || "Código inválido ou expirado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async () => {
    if (cooldown > 0 || reenviando) return;
    setReenviando(true);
    setErro(null);
    try {
      await reenviarCodigo(email);
      setSucesso("Novo código enviado para seu e-mail!");
      setCooldown(60);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } | string }; message?: string };
      const serverMsg =
        typeof errorObj?.response?.data === "string"
          ? errorObj.response.data
          : errorObj?.response?.data?.message;
      setErro(serverMsg || "Erro ao reenviar código. Tente novamente.");
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{definirSenha ? "Definir Senha de Acesso" : "Confirmar E-mail"}</h3>
          <button type="button" className={styles.btnClose} onClick={handleClose} aria-label="Fechar">
            &times;
          </button>
        </div>

        <form onSubmit={handleConfirmar} className={styles.modalBody}>
          <p className={styles.descricao}>
            {definirSenha
              ? <>Para proteger sua conta, enviamos um código de segurança para <span className={styles.emailDestaque}>{email}</span>. Confirme-o abaixo para cadastrar sua nova senha e acessar o sistema:</>
              : <>Enviamos um código de 6 dígitos para o endereço <span className={styles.emailDestaque}>{email}</span>. Digite-o abaixo para confirmar sua conta:</>}
          </p>

          {erro && <div className={styles.feedbackErro}>{erro}</div>}
          {sucesso && <div className={styles.feedbackSucesso}>{sucesso}</div>}

          <div className={styles.codigoInputs}>
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={d}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={styles.codigoInput}
                disabled={loading}
              />
            ))}
          </div>

          <Button type="submit" disabled={loading || digits.join("").length !== 6}>
            {loading ? "Verificando..." : "Confirmar Código"}
          </Button>

          <div className={styles.reenviarSecao}>
            <span>Não recebeu o código?</span>
            <button
              type="button"
              className={styles.linkReenviar}
              onClick={handleReenviar}
              disabled={cooldown > 0 || reenviando}
            >
              {cooldown > 0 ? `Reenviar em ${cooldown}s` : reenviando ? "Enviando..." : "Reenviar código"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
