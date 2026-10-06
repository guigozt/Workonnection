import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { chatService } from '../../services/chatService';
import { usuarioService } from '../../services/usuarioService';
import { getPusherClient } from '../../services/pusher';
import type { ConversaResumoDTO, MensagemResponseDTO } from '../../types/chat';
import type { UsuarioPublicoDTO } from '../../types/usuarios';

export const useChat = () => {
  const { usuario: usuarioLogado } = useAuth();
  const [searchParams] = useSearchParams();
  const contatoIdParam = searchParams.get('contatoId');

  const [conversas, setConversas] = useState<ConversaResumoDTO[]>([]);
  const [contatoSelecionado, setContatoSelecionado] = useState<UsuarioPublicoDTO | null>(null);
  const [mensagens, setMensagens] = useState<MensagemResponseDTO[]>([]);
  const [carregandoConversas, setCarregandoConversas] = useState(true);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [textoMensagem, setTextoMensagem] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');

  const fimMensagensRef = useRef<HTMLDivElement>(null);
  const contatoSelecionadoRef = useRef<UsuarioPublicoDTO | null>(null);

  // Mantém a ref sincronizada para uso dentro do polling e eventos
  useEffect(() => {
    contatoSelecionadoRef.current = contatoSelecionado;
  }, [contatoSelecionado]);

  // Rola para a mensagem mais recente
  const rolarParaFim = useCallback((smooth = true) => {
    if (fimMensagensRef.current) {
      fimMensagensRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  // Carrega todas as conversas
  const carregarConversas = useCallback(async () => {
    try {
      const lista = await chatService.listarConversas();
      setConversas(lista);
      return lista;
    } catch (err) {
      console.error('Erro ao listar conversas:', err);
      return [];
    }
  }, []);

  // Seleciona um contato e carrega seu histórico
  const selecionarContato = useCallback(
    async (contato: UsuarioPublicoDTO) => {
      if (!contato || !contato.id) return;
      const contatoId = String(contato.id);

      setContatoSelecionado(contato);
      setCarregandoMensagens(true);
      try {
        const historico = await chatService.obterMensagens(contatoId);
        setMensagens(historico);
        await chatService.marcarComoLida(contatoId);

        // Atualiza contagem local de não lidas para o contato
        setConversas((prev) =>
          prev.map((c) =>
            String(c.contato.id) === contatoId ? { ...c, naoLidasCount: 0 } : c
          )
        );
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      } finally {
        setCarregandoMensagens(false);
        setTimeout(() => rolarParaFim(false), 50);
      }
    },
    [rolarParaFim]
  );

  // Inicialização e tratamento do query param ?contatoId=...
  useEffect(() => {
    let ativo = true;

    const inicializar = async () => {
      setCarregandoConversas(true);
      const lista = await carregarConversas();
      if (!ativo) return;

      if (contatoIdParam) {
        const conversaExistente = lista.find(
          (c) => String(c.contato.id) === String(contatoIdParam)
        );
        if (conversaExistente) {
          selecionarContato(conversaExistente.contato);
        } else {
          // Contato ainda sem mensagens anteriores: busca dados para iniciar nova conversa
          try {
            const perfilContato = await usuarioService.buscarPerfilPublico(contatoIdParam);
            if (ativo && perfilContato) {
              selecionarContato(perfilContato);
            }
          } catch (err) {
            console.error('Erro ao carregar contato por ID:', err);
          }
        }
      } else if (lista.length > 0 && !contatoSelecionadoRef.current) {
        selecionarContato(lista[0].contato);
      }

      if (ativo) {
        setCarregandoConversas(false);
      }
    };

    inicializar();

    return () => {
      ativo = false;
    };
  }, [carregarConversas, contatoIdParam, selecionarContato]);

  // Tempo Real via Pusher Channels
  useEffect(() => {
    if (!usuarioLogado?.id) return;

    const pusher = getPusherClient();
    const canalNome = `chat-${usuarioLogado.id}`;
    const canal = pusher.subscribe(canalNome);

    const onNovaMensagem = async (novaMsg: MensagemResponseDTO) => {
      const contatoAtual = contatoSelecionadoRef.current;
      const ehContatoAberto =
        contatoAtual &&
        (String(contatoAtual.id) === String(novaMsg.remetenteId) ||
          String(contatoAtual.id) === String(novaMsg.destinatarioId));

      if (ehContatoAberto) {
        setMensagens((prev) => {
          if (prev.some((m) => m.id === novaMsg.id)) return prev;
          return [...prev, novaMsg];
        });
        setTimeout(() => rolarParaFim(true), 50);

        if (String(novaMsg.remetenteId) !== String(usuarioLogado.id)) {
          try {
            await chatService.marcarComoLida(String(novaMsg.remetenteId));
          } catch {
            // ignora
          }
        }
      }

      await carregarConversas();
    };

    const onMensagemEditada = (msgEditada: MensagemResponseDTO) => {
      setMensagens((prev) =>
        prev.map((m) => (m.id === msgEditada.id ? { ...m, ...msgEditada } : m))
      );
      setConversas((prev) =>
        prev.map((c) =>
          c.ultimaMensagem?.id === msgEditada.id
            ? { ...c, ultimaMensagem: { ...c.ultimaMensagem, ...msgEditada } }
            : c
        )
      );
    };

    const onMensagemExcluida = (dados: { mensagemId: string }) => {
      setMensagens((prev) => prev.filter((m) => m.id !== dados.mensagemId));
      carregarConversas();
    };

    const onConversaExcluida = (dados: { contatoId: string }) => {
      const contatoAtual = contatoSelecionadoRef.current;
      if (contatoAtual && String(contatoAtual.id) === String(dados.contatoId)) {
        setMensagens([]);
      }
      setConversas((prev) => prev.filter((c) => String(c.contato.id) !== String(dados.contatoId)));
    };

    const onMensagensLidas = (dados: { leitorId: string }) => {
      const contatoAtual = contatoSelecionadoRef.current;
      if (contatoAtual && String(contatoAtual.id) === String(dados.leitorId)) {
        setMensagens((prev) =>
          prev.map((m) =>
            String(m.remetenteId) === String(usuarioLogado.id)
              ? { ...m, lida: true }
              : m
          )
        );
      }
    };

    canal.bind('nova-mensagem', onNovaMensagem);
    canal.bind('mensagem-editada', onMensagemEditada);
    canal.bind('mensagem-excluida', onMensagemExcluida);
    canal.bind('conversa-excluida', onConversaExcluida);
    canal.bind('mensagens-lidas', onMensagensLidas);

    return () => {
      canal.unbind('nova-mensagem', onNovaMensagem);
      canal.unbind('mensagem-editada', onMensagemEditada);
      canal.unbind('mensagem-excluida', onMensagemExcluida);
      canal.unbind('conversa-excluida', onConversaExcluida);
      canal.unbind('mensagens-lidas', onMensagensLidas);
      pusher.unsubscribe(canalNome);
    };
  }, [usuarioLogado?.id, carregarConversas, rolarParaFim]);

  // Backup / Heartbeat leve a cada 8 segundos (caso a aba tenha ficado suspensa)
  useEffect(() => {
    const intervalo = setInterval(async () => {
      const contatoAtual = contatoSelecionadoRef.current;
      if (contatoAtual && contatoAtual.id) {
        try {
          const novas = await chatService.obterMensagens(String(contatoAtual.id));
          setMensagens((antigas) => {
            if (novas.length !== antigas.length) {
              setTimeout(() => rolarParaFim(true), 50);
              return novas;
            }
            const mudouStatus = novas.some(
              (n, idx) =>
                antigas[idx] &&
                (antigas[idx].lida !== n.lida ||
                  antigas[idx].conteudo !== n.conteudo ||
                  antigas[idx].editada !== n.editada)
            );
            return mudouStatus ? novas : antigas;
          });
        } catch {
          // ignora
        }
      }

      try {
        const listaAtualizada = await chatService.listarConversas();
        setConversas(listaAtualizada);
      } catch {
        // ignora
      }
    }, 8000);

    return () => clearInterval(intervalo);
  }, [rolarParaFim]);

  // Enviar mensagem
  const enviarMensagem = async () => {
    const conteudo = textoMensagem.trim();
    if (!conteudo || !contatoSelecionado || !contatoSelecionado.id || enviando) return;

    setEnviando(true);
    try {
      const enviada = await chatService.enviarMensagem(String(contatoSelecionado.id), conteudo);
      setMensagens((prev) => {
        if (prev.some((m) => m.id === enviada.id)) return prev;
        return [...prev, enviada];
      });
      setTextoMensagem('');
      setTimeout(() => rolarParaFim(true), 50);

      // Atualiza conversa na lista lateral
      await carregarConversas();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setEnviando(false);
    }
  };

  // Editar mensagem
  const editarMensagem = async (mensagemId: string, novoConteudo: string) => {
    if (!novoConteudo.trim()) return;
    try {
      const atualizada = await chatService.editarMensagem(mensagemId, novoConteudo.trim());
      setMensagens((prev) =>
        prev.map((m) => (m.id === mensagemId ? { ...m, ...atualizada } : m))
      );
      await carregarConversas();
    } catch (err) {
      console.error('Erro ao editar mensagem:', err);
      throw err;
    }
  };

  // Excluir mensagem individual (unilateral)
  const excluirMensagem = async (mensagemId: string) => {
    try {
      await chatService.excluirMensagem(mensagemId);
      setMensagens((prev) => prev.filter((m) => m.id !== mensagemId));
      await carregarConversas();
    } catch (err) {
      console.error('Erro ao excluir mensagem:', err);
      throw err;
    }
  };

  // Excluir conversa inteira com o contato (unilateral)
  const excluirConversa = async (contatoId: string) => {
    try {
      await chatService.excluirConversa(contatoId);
      if (contatoSelecionado && String(contatoSelecionado.id) === String(contatoId)) {
        setMensagens([]);
      }
      setConversas((prev) => prev.filter((c) => String(c.contato.id) !== String(contatoId)));
    } catch (err) {
      console.error('Erro ao excluir conversa:', err);
      throw err;
    }
  };

  // Conversas filtradas pelo campo de pesquisa
  const conversasFiltradas = conversas.filter((c) => {
    const nome = c.contato.nome?.toLowerCase() || '';
    const busca = filtroBusca.toLowerCase().trim();
    return nome.includes(busca);
  });

  return {
    usuarioLogado,
    conversas: conversasFiltradas,
    contatoSelecionado,
    mensagens,
    carregandoConversas,
    carregandoMensagens,
    enviando,
    textoMensagem,
    setTextoMensagem,
    filtroBusca,
    setFiltroBusca,
    selecionarContato,
    enviarMensagem,
    editarMensagem,
    excluirMensagem,
    excluirConversa,
    fimMensagensRef,
  };
};
