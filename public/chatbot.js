var chatContainer = document.querySelector(".chat-container");
var chatMessages = document.getElementById("chat-messages");

var cnpj;
var nome;
var email;

function sendMessage() {
  var userInput = document.getElementById("user-input").value;

  if (userInput.trim() === "") {
    return;
  }

  // Criar nova mensagem do usuário
  var userMessage = document.createElement("div");
  userMessage.className = "message";
  userMessage.innerHTML = `<div class="user-message">${userInput}</div>`;
  chatMessages.appendChild(userMessage);

  // Chamar função de chat para obter resposta
  var botResponse = chatbot(userInput);

  // Criar nova mensagem do bot com a resposta
  var botMessage = document.createElement("div");
  botMessage.className = "message";
  botMessage.innerHTML = `<div class="bot-message">${botResponse}</div>`;
  chatMessages.appendChild(botMessage);

  // Limpar campo de entrada do usuário
  document.getElementById("user-input").value = "";

  // Rolagem automática para exibir a nova mensagem
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
}

// Função de chat para gerar respostas
function chatbot(input) {
  var response = "";

  if (input.toLowerCase().includes("balancete")) {
    response = "Ótimo! Vou precisar de algumas informações para gerar o balancete.";
    response += "<br>Por favor, digite o CNPJ da empresa.";
  } else if (cnpj === undefined) {
    cnpj = input;
    response = "Ótimo! Agora, digite o nome da empresa.";
  } else if (nome === undefined) {
    nome = input;
    response = "Perfeito! Agora, digite o email da empresa.";
  } else if (email === undefined) {
    email = input;
    response = "Gerando balancete para o CNPJ: " + cnpj + "<br>da empresa " + nome + "<br>com o email " + email;
  } else {
    response = "Desculpe, não entendi. Pode repetir?";
  }
  // Enviar os dados para a API
  enviarDadosParaAPI(cnpj, nome, email);
  return response;
}
function enviarDadosParaAPI(cnpj, nome, email) {
  // Construa o objeto de dados para enviar na solicitação
  var data = {
    cnpj: cnpj,
    nome: nome,
    email: email
  };
  console.log(data)
  // Opções da solicitação
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  // URL da API para enviar os dados
  var apiUrl = 'https://exemplo.com/api/endpoint';

  // Fazer a solicitação para a API
  fetch(apiUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro na solicitação');
      }
    })
    .then(data => {
      // Processar a resposta da API, se necessário
      console.log('Resposta da API:', data);
    })
    .catch(error => {
      console.error('Erro na solicitação:', error);
    });
}
