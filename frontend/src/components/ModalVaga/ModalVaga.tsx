import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import type { VagaResponseDTO, VagaDTO } from '../../types/vagas';
import { api } from '../../services/api';
import styles from './ModalVaga.module.css';

export interface VagaData extends Partial<VagaDTO> {
  [x: string]: any;
  id?: string | number;
  horarioInicio?: string;
  horarioFim?: string;
}

interface ModalVagaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vaga: VagaResponseDTO) => void;
  vagaParaEditar?: VagaResponseDTO | null;
}

const initialForm: VagaData = {
  empresa: '',
  cargo: '',
  modalidade: '',
  localizacao: '',
  salario: '',
  data: '',
  email: '',
  descricao: '',
  requisitos: '',
  beneficios: '',
  horarioInicio: '',
  horarioFim: '',
  tiposUsuario: [],
};

export const ModalVaga: React.FC<ModalVagaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vagaParaEditar,
}) => {
  const [formData, setFormData] = useState<VagaData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vagaParaEditar) {
      let ini = '', fim = '';
      if (vagaParaEditar.horario?.includes(' - ')) {
        [ini, fim] = vagaParaEditar.horario.split(' - ');
      }
      setFormData({
        ...vagaParaEditar,
        horarioInicio: ini,
        horarioFim: fim,
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [vagaParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleChipClick = (valor: string) => {
    let atualizados: string[] = [];
    const lista = formData.tiposUsuario || [];

    if (valor === 'todos') {
      atualizados = lista.includes('todos') ? [] : ['todos'];
    } else {
      const semTodos = lista.filter((t) => t !== 'todos');
      atualizados = semTodos.includes(valor)
        ? semTodos.filter((t) => t !== valor)
        : [...semTodos, valor];
    }
    setFormData((prev) => ({ ...prev, tiposUsuario: atualizados }));
    if (errors.tiposUsuario) setErrors((prev) => ({ ...prev, tiposUsuario: '' }));
  };

  const validar = () => {
    const newErrors: Record<string, string> = {};
    const hoje = new Date().toISOString().split('T')[0];

    if (!formData.empresa?.trim()) newErrors.empresa = 'Obrigatório';
    if (!formData.cargo?.trim()) newErrors.cargo = 'Obrigatório';
    if (!formData.modalidade?.trim()) newErrors.modalidade = 'Obrigatório';
    if (!formData.localizacao?.trim()) newErrors.localizacao = 'Obrigatório';
    if (!formData.salario?.trim()) newErrors.salario = 'Obrigatório';
    if (!formData.beneficios?.trim()) newErrors.beneficios = 'Obrigatório';

    if (!formData.data) newErrors.data = 'Obrigatório';
    else if (formData.data < hoje) newErrors.data = 'Data no passado não é permitida';

    if ((formData.descricao?.length || 0) < 10) newErrors.descricao = 'Mínimo 10 caracteres';
    if ((formData.requisitos?.length || 0) < 5) newErrors.requisitos = 'Mínimo 5 caracteres';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '')) newErrors.email = 'E-mail inválido';

    if (!formData.horarioInicio || !formData.horarioFim || formData.horarioInicio >= formData.horarioFim) {
      newErrors.horario = 'Hora final deve ser maior que a inicial';
    }

    if (!formData.tiposUsuario?.length) newErrors.tiposUsuario = 'Selecione ao menos um tipo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    setIsSubmitting(true);
    const payload = {
      ...formData,
      horario: `${formData.horarioInicio} - ${formData.horarioFim}`,
    };

    try {
      let response;

      if (vagaParaEditar?.id) {
        response = await api.put(`/vagas/${vagaParaEditar.id}`, payload);
      } else {
        response = await api.post('/vagas', payload);
      }

      onSuccess(response.data);
      onClose();
    } catch (error: any) {
      console.error(error);
      const mensagemErro = error.response?.data?.erro || 'Erro ao conectar no servidor.';
      alert(mensagemErro);
      alert('Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const temTodos = formData.tiposUsuario?.includes('todos');

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{vagaParaEditar ? 'Editar Vaga' : 'Nova Vaga'}</h3>
          <button type="button" className={styles.btnClose} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className={styles.modalBody}>
            <div>
              <div className={styles.secaoTitulo}>Informações principais</div>
              <div className={styles.grid}>
                <div className={styles.campo}>
                  <label>Empresa</label>
                  <input name="empresa" value={formData.empresa || ''} onChange={handleChange} className={errors.empresa ? styles.inputErro : ''} placeholder="Ex: Workonnection" />
                  <span className={styles.msgErro}>{errors.empresa}</span>
                </div>

                <div className={styles.campo}>
                  <label>Cargo</label>
                  <input name="cargo" value={formData.cargo || ''} onChange={handleChange} className={errors.cargo ? styles.inputErro : ''} placeholder="Ex: Desenvolvedor" />
                  <span className={styles.msgErro}>{errors.cargo}</span>
                </div>

                <div className={styles.campo}>
                  <label>Modalidade</label>
                  <input name="modalidade" value={formData.modalidade || ''} onChange={handleChange} className={errors.modalidade ? styles.inputErro : ''} placeholder="Presencial, Remoto, Híbrido" />
                  <span className={styles.msgErro}>{errors.modalidade}</span>
                </div>

                <div className={styles.campo}>
                  <label>Horário</label>
                  <div className={styles.horarioGroup}>
                    <input type="time" name="horarioInicio" value={formData.horarioInicio || ''} onChange={handleChange} className={errors.horario ? styles.inputErro : ''} />
                    <span>até</span>
                    <input type="time" name="horarioFim" value={formData.horarioFim || ''} onChange={handleChange} className={errors.horario ? styles.inputErro : ''} />
                  </div>
                  <span className={styles.msgErro}>{errors.horario}</span>
                </div>

                <div className={styles.campo}>
                  <label>Localização</label>
                  <input name="localizacao" value={formData.localizacao || ''} onChange={handleChange} className={errors.localizacao ? styles.inputErro : ''} placeholder="Ex: São Paulo, SP" />
                  <span className={styles.msgErro}>{errors.localizacao}</span>
                </div>

                <div className={styles.campo}>
                  <label>Salário</label>
                  <input name="salario" value={formData.salario || ''} onChange={handleChange} className={errors.salario ? styles.inputErro : ''} placeholder="Ex: R$ 1.500,00" />
                  <span className={styles.msgErro}>{errors.salario}</span>
                </div>

                <div className={styles.campo}>
                  <label>Data de Expiração</label>
                  <input type="date" name="data" value={formData.data || ''} onChange={handleChange} className={errors.data ? styles.inputErro : ''} />
                  <span className={styles.msgErro}>{errors.data}</span>
                </div>

                <div className={styles.campo}>
                  <label>E-mail de Contato</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={errors.email ? styles.inputErro : ''} placeholder="contato@empresa.com" />
                  <span className={styles.msgErro}>{errors.email}</span>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.secaoTitulo}>Detalhes da vaga</div>
              <div className={styles.gridFull}>
                <div className={styles.campo}>
                  <label>Descrição</label>
                  <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} className={errors.descricao ? styles.inputErro : ''} placeholder="Descreva as responsabilidades..." />
                  <span className={styles.msgErro}>{errors.descricao}</span>
                </div>

                <div className={styles.campo}>
                  <label>Requisitos</label>
                  <textarea name="requisitos" value={formData.requisitos || ''} onChange={handleChange} className={errors.requisitos ? styles.inputErro : ''} placeholder="Ex: React, TypeScript..." />
                  <span className={styles.msgErro}>{errors.requisitos}</span>
                </div>

                <div className={styles.campo}>
                  <label>Benefícios</label>
                  <input name="beneficios" value={formData.beneficios || ''} onChange={handleChange} className={errors.beneficios ? styles.inputErro : ''} placeholder="Ex: VT, VA, Plano de Saúde" />
                  <span className={styles.msgErro}>{errors.beneficios}</span>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.secaoTitulo}>Quem pode se candidatar</div>
              <div className={styles.tiposGrid}>
                <button
                  type="button"
                  className={`${styles.tipoChip} ${formData.tiposUsuario?.includes('todos') ? styles.selecionado : ''}`}
                  onClick={() => handleChipClick('todos')}
                >
                  <i className="fas fa-globe" /> Todos
                </button>

                <button
                  type="button"
                  className={`${styles.tipoChip} ${formData.tiposUsuario?.includes('prestador') ? styles.selecionado : ''} ${temTodos ? styles.desabilitado : ''}`}
                  onClick={() => handleChipClick('prestador')}
                >
                  <i className="fas fa-briefcase" /> Prestador de Serviço
                </button>

                <button
                  type="button"
                  className={`${styles.tipoChip} ${formData.tiposUsuario?.includes('estudante') ? styles.selecionado : ''} ${temTodos ? styles.desabilitado : ''}`}
                  onClick={() => handleChipClick('estudante')}
                >
                  <i className="fas fa-graduation-cap" /> Estudante
                </button>
              </div>
              <span className={styles.msgErro}>{errors.tiposUsuario}</span>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className="btn-secundary" onClick={onClose}>
              Cancelar
            </button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar Vaga
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};