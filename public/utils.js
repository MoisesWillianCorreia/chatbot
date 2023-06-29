export function clearConversation() {
  // Limpar as variáveis
  cnpj = undefined;
  nome = undefined;
  email = undefined;
  balancete = false;

  // Limpar as mensagens no chat
  chatMessages.innerHTML = "";
}