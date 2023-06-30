var chatContainer = document.querySelector(".chat-container");
var chatMessages = document.getElementById("chat-messages");

var cnpj;
var nome;
var email;
var balancete = false;
var functionList = ["balancete"];
var userInput;
function createFunctionList() {
  var functionListContainer = document.createElement("ul");

  for (var i = 0; i < functionList.length; i++) {
    var functionName = functionList[i];
    var listItem = document.createElement("li");
    var button = document.createElement("button");
    button.textContent = functionName;
    button.classList.add("function-button"); // Adicione a classe CSS para estilização
  
    button.onclick = (function(index) {
      return function() {
        userInput = functionList[index];
        sendMessage();
      };
    })(i);
  
    listItem.appendChild(button);
    functionListContainer.appendChild(listItem);
  }
  
  return functionListContainer;
}

// Chamada da função para criar a lista de funções
var functionListElement = createFunctionList();

// Adicionar a lista de funções na primeira mensagem
var firstBotMessage = document.querySelector(".bot-message");
firstBotMessage.appendChild(functionListElement);
function sendMessage() {
  console.log(userInput)
  if(userInput === undefined)
    userInput = document.getElementById("user-input").value;

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
  userInput = undefined;

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

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
}

function isValidEmail(email) {
  // Expressão regular para validar o formato do email
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
}

function clearConversation() {
  // Limpar as variáveis
  cnpj = undefined;
  nome = undefined;
  email = undefined;
  balancete = false;

  // Limpar as mensagens no chat
  chatMessages.innerHTML = "";
}

// Função para validar o CNPJ
function validarCNPJ(cnpj) {
  // Remover caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]+/g, '');

  // Verificar se o CNPJ possui 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calcular os dígitos verificadores
  var tamanho = cnpj.length - 2;
  var numeros = cnpj.substring(0, tamanho);
  var digitos = cnpj.substring(tamanho);
  var soma = 0;
  var pos = tamanho - 7;

  for (var i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== parseInt(digitos.charAt(0), 10)) {
    return false;
  }

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (var j = tamanho; j >= 1; j--) {
    soma += numeros.charAt(tamanho - j) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== parseInt(digitos.charAt(1), 10)) {
    return false;
  }

  return true;
}

// Função de chat para gerar respostas
function chatbot(input) {
  var response = "";

  if (input.toLowerCase().includes("balancete")) {
    balancete = true;
  }

  if (balancete) {
    if (input.toLowerCase().includes("balancete")) {
      response = "Ótimo! Vou precisar de algumas informações para gerar o balancete.";
      response += "<br>Por favor, digite o CNPJ da empresa.";
    } else if (cnpj === undefined) {
      if (validarCNPJ(input)) {
        cnpj = input;
        response = "Ótimo! Agora, digite o nome da empresa.";
      } else {
        response = "CNPJ inválido. Por favor, digite um CNPJ válido.";
      }
    } else if (nome === undefined) {
      nome = input;
      response = "Perfeito! Agora, digite o email da empresa.";
    } else if (email === undefined) {
      if (isValidEmail(input)) {
        email = input;
        response = "Gerando balancete para o CNPJ: " + cnpj + "<br>da empresa " + nome + "<br>com o email " + email+ "...";
        enviarDadosParaAPI(cnpj, nome, email);
      } else {
        response = "Email inválido. Por favor, digite um email válido.";
      }
    } else {
      response = "Desculpe, não entendi. Pode repetir?";
    }
  } else {
    response = "Desculpe, não entendi. Pode repetir?";
  }

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
