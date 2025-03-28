const API_URL =
  "https://iara-games-usuario-listajogos-ba-production-ac26.up.railway.app/jogo";

document.addEventListener("DOMContentLoaded", () => {
  carregarJogos();
  document.getElementById("jogo-form").addEventListener("submit", salvarJogo);
  document
    .getElementById("cancel-edit")
    .addEventListener("click", cancelarEdicao);
});

// 🟢 LISTAR TODOS OS JOGOS
function carregarJogos() {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar jogos");
      }
      return response.json(); // Converta a resposta para JSON
    })
    .then((jogos) => {
      console.log(jogos); // Verifique o que está sendo retornado pela API
      const lista = document.getElementById("jogo-list");
      lista.innerHTML = "";

      jogos.forEach((jogo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${jogo.id}</td>
          <td>${jogo.nome}</td>
          <td>${jogo.categoria}</td>
          <td>R$ ${jogo.preco.toFixed(2)}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarJogo(${
              jogo.id
            }, '${jogo.nome}', '${jogo.categoria}', ${
          jogo.preco
        })">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletarJogo(${
              jogo.id
            })">Excluir</button>
          </td>
        `;
        lista.appendChild(row);
      });
    })
    .catch((error) => console.error("Erro ao carregar jogos:", error)); // Trate os erros
}

// ✏️ EDITAR JOGO
function editarJogo(id, nome, categoria, preco) {
  document.getElementById("jogo-id").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("categoria").value = categoria;
  document.getElementById("preco").value = preco;

  document.getElementById("form-title").textContent = "Editar Jogo";
  document.getElementById("cancel-edit").style.display = "inline"; // Mostrar botão de cancelar
}

// 🔄 CANCELAR EDIÇÃO
function cancelarEdicao() {
  document.getElementById("jogo-form").reset();
  document.getElementById("jogo-id").value = "";
  document.getElementById("form-title").textContent = "Cadastrar Novo Jogo";
  document.getElementById("cancel-edit").style.display = "none";
}

// ➕ CADASTRAR/EDITAR UM JOGO
function salvarJogo(event) {
  event.preventDefault();

  const id = document.getElementById("jogo-id").value;
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const preco = document.getElementById("preco").value;

  const jogo = { nome, categoria, preco: parseFloat(preco) };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jogo),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao salvar jogo");
      }
      return response.json();
    })
    .then(() => {
      carregarJogos();
      cancelarEdicao();
    })
    .catch((error) => console.error("Erro ao salvar jogo:", error));
}

// 🗑️ DELETAR JOGO
function deletarJogo(id) {
  if (confirm("Tem certeza que deseja excluir este jogo?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        carregarJogos(); // Recarregar a lista de jogos após a exclusão
      })
      .catch((error) => console.error("Erro ao excluir jogo:", error));
  }
}
