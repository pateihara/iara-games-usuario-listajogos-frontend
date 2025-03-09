const API_URL = "http://localhost:8080/usuario"; // URL correta da API

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();
  document
    .getElementById("usuario-form")
    .addEventListener("submit", salvarUsuario);
  document
    .getElementById("cancel-edit")
    .addEventListener("click", cancelarEdicao);
});

// 🟢 LISTAR TODOS OS USUÁRIOS
function carregarUsuarios() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((usuarios) => {
      const lista = document.getElementById("usuario-list");
      lista.innerHTML = "";

      usuarios.forEach((usuario) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deletarUsuario(${usuario.id})">Excluir</button>
                    </td>
                `;
        lista.appendChild(row);
      });
    })
    .catch((error) => console.error("Erro ao carregar usuários:", error));
}

// ✏️ EDITAR USUÁRIO
function editarUsuario(id, nome, email) {
  document.getElementById("usuario-id").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;

  document.getElementById("form-title").textContent = "Editar Usuário";
  document.getElementById("cancel-edit").style.display = "inline"; // Mostrar botão de cancelar
}

// 🔄 CANCELAR EDIÇÃO
function cancelarEdicao() {
  document.getElementById("usuario-form").reset();
  document.getElementById("usuario-id").value = "";
  document.getElementById("form-title").textContent = "Cadastrar Novo Usuário";
  document.getElementById("cancel-edit").style.display = "none";
}

// ➕ CADASTRAR/EDITAR UM USUÁRIO
function salvarUsuario(event) {
  event.preventDefault(); // Evita que o formulário recarregue a página

  const id = document.getElementById("usuario-id").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  const usuario = { nome, email };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao salvar usuário");
      }
      return response.json();
    })
    .then(() => {
      carregarUsuarios();
      cancelarEdicao();
    })
    .catch((error) => console.error("Erro ao salvar usuário:", error));
}

// 🗑️ DELETAR USUÁRIO
function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => carregarUsuarios())
      .catch((error) => console.error("Erro ao excluir usuário:", error));
  }
}
