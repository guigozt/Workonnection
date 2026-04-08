function thumbsUp(vagaId){
    alert("Você curtiu a vaga " + vagaId)
}

function thumbsDown(vagaId){
    alert("Você descurtiu a vaga " + vagaId)
}

function openWhatsApp(empresa, localizacao){
    const mensagem = `Olá, gostaria de saber mais sobre a vaga da empresa ${empresa} localizada em ${localizacao}.`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank')
}

function openChat(empresa) {
    alert(`Abrindo chat (FAQ) para ${empresa}.`);
}


