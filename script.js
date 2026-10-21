/* ==================================================
   CONFIGURAÇÕES
================================================== */

const SENHA_PADRAO = "2580";
const MAX_TENTATIVAS = 3;
const TEMPO_BLOQUEIO = 60;


/* ==================================================
   SENHA SALVA
================================================== */

let senhaCorreta =
    localStorage.getItem("senhaCofre") || SENHA_PADRAO;


/* ==================================================
   ELEMENTOS DA PÁGINA DO COFRE
================================================== */

const cofre =
    document.getElementById("cofre");

const display =
    document.getElementById("display");

const status =
    document.getElementById("status");

const led =
    document.getElementById("led");

const numeroTentativas =
    document.getElementById("numeroTentativas");


/* ==================================================
   ELEMENTOS DA PÁGINA DE SENHA
================================================== */

const senhaAtual =
    document.getElementById("senhaAtual");

const novaSenha =
    document.getElementById("novaSenha");

const confirmarSenha =
    document.getElementById("confirmarSenha");

const mensagem =
    document.getElementById("mensagem");


/* ==================================================
   VARIÁVEIS DO COFRE
================================================== */

let senhaDigitada = "";

let tentativas =
    MAX_TENTATIVAS;

let bloqueado = false;

let tempoRestante = 0;

let intervaloBloqueio = null;

let cofreAberto = false;


/* ==================================================
   FUNÇÃO PARA VERIFICAR SE É PÁGINA DO COFRE
================================================== */

function paginaDoCofre() {
    return !!display;
}


/* ==================================================
   FUNÇÃO PARA VERIFICAR SENHA
================================================== */

function senhaValida(senha) {
    return (
        typeof senha === "string" &&
        /^[0-9]{4}$/.test(senha)
    );
}


/* ==================================================
   DIGITAR NO TECLADO VISUAL
================================================== */

function digitar(numero) {

    if (!paginaDoCofre()) {
        return;
    }

    if (bloqueado) {
        return;
    }

    if (cofreAberto) {
        return;
    }

    if (!/^[0-9]$/.test(String(numero))) {
        return;
    }

    if (senhaDigitada.length >= 4) {
        return;
    }

    senhaDigitada += String(numero);

    atualizarDisplay();
}


/* ==================================================
   DISPLAY
================================================== */

function atualizarDisplay() {

    if (!display) {
        return;
    }

    let texto = "";

    for (let i = 0; i < 4; i++) {

        if (i < senhaDigitada.length) {
            texto += "●";
        } else {
            texto += "-";
        }
    }

    display.textContent = texto;
}


/* ==================================================
   LIMPAR SENHA
================================================== */

function limpar() {

    if (!paginaDoCofre()) {
        return;
    }

    if (bloqueado) {
        return;
    }

    if (cofreAberto) {
        return;
    }

    senhaDigitada = "";

    display.classList.remove("erro");

    cofre.classList.remove("erro");

    status.textContent =
        "DIGITE A SENHA";

    atualizarDisplay();
}


/* ==================================================
   CONFIRMAR SENHA
================================================== */

function confirmar() {

    if (!paginaDoCofre()) {
        return;
    }

    if (bloqueado) {
        return;
    }

    if (cofreAberto) {
        return;
    }

    if (senhaDigitada.length !== 4) {

        mostrarErro(
            "DIGITE 4 NÚMEROS"
        );

        return;
    }


    /* ==============================================
       SENHA CORRETA
    ============================================== */

    if (senhaDigitada === senhaCorreta) {

        abrirCofre();

        return;
    }


    /* ==============================================
       SENHA ERRADA
    ============================================== */

    tentativas--;

    atualizarTentativas();


    if (tentativas <= 0) {

        iniciarBloqueio();

        return;
    }


    display.textContent = "ERRO";

    display.classList.add("erro");

    status.textContent =
        "SENHA INCORRETA";

    cofre.classList.add("erro");


    setTimeout(function () {

        senhaDigitada = "";

        display.classList.remove("erro");

        cofre.classList.remove("erro");

        status.textContent =
            "TENTE NOVAMENTE";

        atualizarDisplay();

    }, 900);
}


/* ==================================================
   ATUALIZAR TENTATIVAS
================================================== */

function atualizarTentativas() {

    if (!numeroTentativas) {
        return;
    }

    numeroTentativas.textContent =
        tentativas;
}


/* ==================================================
   BLOQUEAR COFRE
================================================== */

function iniciarBloqueio() {

    if (bloqueado) {
        return;
    }

    bloqueado = true;

    tempoRestante =
        TEMPO_BLOQUEIO;

    senhaDigitada = "";


    /* LED */

    if (led) {
        led.classList.add("bloqueado");
    }


    /* DISPLAY */

    if (display) {
        display.classList.add("erro");
    }


    /* DESABILITAR TECLADO */

    const botoes =
        document.querySelectorAll(
            ".teclado button"
        );

    botoes.forEach(function (botao) {

        botao.disabled = true;

    });


    atualizarContagem();


    /* EVITAR INTERVALOS DUPLICADOS */

    if (intervaloBloqueio !== null) {
        clearInterval(intervaloBloqueio);
    }


    intervaloBloqueio =
        setInterval(function () {

            tempoRestante--;

            atualizarContagem();


            if (tempoRestante <= 0) {

                desbloquear();

            }

        }, 1000);
}


/* ==================================================
   CONTADOR DO BLOQUEIO
================================================== */

function atualizarContagem() {

    if (!display || !status) {
        return;
    }

    display.textContent =
        tempoRestante + "s";

    status.textContent =
        "COFRE BLOQUEADO";
}


/* ==================================================
   DESBLOQUEAR
================================================== */

function desbloquear() {

    if (intervaloBloqueio !== null) {

        clearInterval(
            intervaloBloqueio
        );

        intervaloBloqueio = null;
    }


    bloqueado = false;

    tentativas =
        MAX_TENTATIVAS;

    senhaDigitada = "";

    atualizarTentativas();


    if (led) {
        led.classList.remove(
            "bloqueado"
        );
    }


    if (display) {

        display.classList.remove(
            "erro"
        );

        display.textContent =
            "----";
    }


    const botoes =
        document.querySelectorAll(
            ".teclado button"
        );


    botoes.forEach(function (botao) {

        botao.disabled = false;

    });


    if (status) {

        status.textContent =
            "DIGITE A SENHA";

    }
}


/* ==================================================
   ABRIR COFRE
================================================== */

function abrirCofre() {

    if (!paginaDoCofre()) {
        return;
    }

    cofreAberto = true;

    senhaDigitada = "";


    display.textContent =
        "OPEN";

    status.textContent =
        "COFRE ABERTO";


    if (led) {

        led.classList.remove(
            "bloqueado"
        );

        led.classList.add(
            "aberto"
        );

    }


    cofre.classList.remove(
        "erro"
    );

    cofre.classList.add(
        "aberto"
    );


    const botoes =
        document.querySelectorAll(
            ".teclado button"
        );


    botoes.forEach(function (botao) {

        botao.disabled = true;

    });


    /*
       Aqui futuramente você pode
       enviar uma ordem para o ESP32.

       Exemplo:

       fetch("/api/cofre/abrir", {
           method: "POST"
       });
    */
}


/* ==================================================
   ERRO
================================================== */

function mostrarErro(texto) {

    if (!display || !status || !cofre) {
        return;
    }


    display.textContent =
        "ERRO";

    display.classList.add(
        "erro"
    );

    status.textContent =
        texto;

    cofre.classList.add(
        "erro"
    );


    setTimeout(function () {

        senhaDigitada = "";

        display.classList.remove(
            "erro"
        );

        cofre.classList.remove(
            "erro"
        );

        status.textContent =
            "DIGITE A SENHA";

        atualizarDisplay();

    }, 700);
}


/* ==================================================
   ALTERAR SENHA
================================================== */

function salvarNovaSenha() {

    /*
       Essa função só existe
       na página senha.html.
    */

    if (!senhaAtual) {
        return;
    }


    const atual =
        senhaAtual.value.trim();

    const nova =
        novaSenha.value.trim();

    const confirmacao =
        confirmarSenha.value.trim();


    /* ==============================================
       VERIFICAR SENHA ATUAL
    ============================================== */

    if (atual !== senhaCorreta) {

        mostrarMensagem(
            "A senha atual está incorreta.",
            false
        );

        return;
    }


    /* ==============================================
       VERIFICAR NOVA SENHA
    ============================================== */

    if (!senhaValida(nova)) {

        mostrarMensagem(
            "A nova senha precisa ter exatamente 4 números.",
            false
        );

        return;
    }


    /* ==============================================
       CONFIRMAR NOVA SENHA
    ============================================== */

    if (nova !== confirmacao) {

        mostrarMensagem(
            "As novas senhas não são iguais.",
            false
        );

        return;
    }


    /* ==============================================
       IMPEDIR SENHA VAZIA
    ============================================== */

    if (!nova) {

        mostrarMensagem(
            "Digite uma nova senha.",
            false
        );

        return;
    }


    /* ==============================================
       SALVAR
    ============================================== */

    localStorage.setItem(
        "senhaCofre",
        nova
    );

    senhaCorreta =
        nova;


    mostrarMensagem(
        "Senha alterada com sucesso!",
        true
    );


    /* LIMPAR CAMPOS */

    senhaAtual.value = "";

    novaSenha.value = "";

    confirmarSenha.value = "";


    /* VOLTAR PARA O COFRE */

    setTimeout(function () {

        window.location.href =
            "index.html";

    }, 1500);
}


/* ==================================================
   MENSAGEM DA PÁGINA DE SENHA
================================================== */

function mostrarMensagem(
    texto,
    sucesso
) {

    if (!mensagem) {
        return;
    }


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem";


    if (sucesso) {

        mensagem.classList.add(
            "sucesso"
        );

    } else {

        mensagem.classList.add(
            "erro"
        );

    }
}


/* ==================================================
   TECLADO FÍSICO DO COMPUTADOR
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (!display) {
            return;
        }


        /* NÚMEROS */

        if (
            event.key >= "0" &&
            event.key <= "9"
        ) {

            digitar(event.key);

        }


        /* ENTER */

        if (
            event.key === "Enter"
        ) {

            confirmar();

        }


        /* BACKSPACE / ESC */

        if (
            event.key === "Backspace" ||
            event.key === "Escape"
        ) {

            limpar();

        }

    }
);


/* ==================================================
   IMPEDIR SUBMIT ACIDENTAL NA PÁGINA DE SENHA
================================================== */

document.addEventListener(
    "submit",
    function (event) {

        if (senhaAtual) {
            event.preventDefault();
        }

    }
);


/* ==================================================
   PROTEÇÃO CONTRA PREENCHIMENTO INCORRETO
================================================== */

if (senhaAtual) {

    senhaAtual.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

        }
    );

}


if (novaSenha) {

    novaSenha.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

        }
    );

}


if (confirmarSenha) {

    confirmarSenha.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

        }
    );

}


/* ==================================================
   INICIALIZAÇÃO DO COFRE
================================================== */

if (display) {

    atualizarDisplay();

    atualizarTentativas();

}