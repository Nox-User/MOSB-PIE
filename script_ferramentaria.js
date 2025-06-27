  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase, ref, onValue, set, push, remove } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

  // Função para alternar abas
  function openTab(evt, tabName) {
    const tabcontents = document.querySelectorAll(".tabcontent");
    tabcontents.forEach(tc => {
      tc.classList.remove("active");
    });

    const tablinks = document.querySelectorAll(".tablinks");
    tablinks.forEach(tl => {
      tl.classList.remove("active");
    });

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
  }

  const firebaseConfig = {
    apiKey: "AIzaSyD53Q57GFkGSYH1p5mAfsxZIGBKnp8AEG8",
    authDomain: "ferramentaria-d120f.firebaseapp.com",
    databaseURL: "https://ferramentaria-d120f-default-rtdb.firebaseio.com",
    projectId: "ferramentaria-d120f",
    storageBucket: "ferramentaria-d120f.appspot.com",
    messagingSenderId: "227336233826",
    appId: "1:227336233826:web:0fa15161281a6d896a823b",
    measurementId: "G-2EVDBKX8S6"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Referências no banco
  const inventoryRef = ref(db, 'inventory');
  const purchasesRef = ref(db, 'purchases');

  // Variáveis locais para guardar os dados
  let inventory = [];
  let purchases = [];

  // Atualiza a tabela do estoque (igual ao seu original)
  function updateInventoryTable(filter = '') {
    const tableBody = document.getElementById('inventoryTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const filterLower = filter.toLowerCase();	

    inventory
    .filter(item =>
       item.code.toLowerCase().includes(filterLower) ||
       item.name.toLowerCase().includes(filterLower)
    )  
    .forEach((item, index) => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = item.code;
      row.insertCell(1).textContent = item.name;
      row.insertCell(2).textContent = item.quantity;

      const actionCell = row.insertCell(3);
      const btnRemove = document.createElement('button');
      btnRemove.textContent = 'Remover';
      btnRemove.className = 'btn-remove';
      btnRemove.onclick = () => {
  	removeProductByCode(item.code);
      };
      actionCell.appendChild(btnRemove);
    });
  }



  // Evento para filtro
  document.getElementById('filterInput').addEventListener('input', (e) => {
    updateInventoryTable(e.target.value);
  });

  // Atualiza a tabela das solicitações de compra
  function updatePurchaseTable() {
    const tableBody = document.getElementById('purchaseTable').querySelector('tbody');
    tableBody.innerHTML = '';

    purchases.forEach((purchase, index) => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = purchase.code;
      row.insertCell(1).textContent = purchase.name;
      row.insertCell(2).textContent = purchase.quantity;

      const actionCell = row.insertCell(3);
      const btnDarBaixa = document.createElement('button');
      btnDarBaixa.textContent = 'Dar Baixa';
      btnDarBaixa.className = 'btn-dar-baixa';
      btnDarBaixa.onclick = () => darBaixa(index);
      actionCell.appendChild(btnDarBaixa);
    });
  }

  function removeProductByCode(code) {
    solicitarRemocao(code);
  /* modal substitui confirm aqui */
      inventory.splice(index, 1);
      saveInventory();
      updateInventoryTable(document.getElementById('filterInput').value);
  }

  // Salva inventory no Firebase
  function saveInventory() {
    set(inventoryRef, inventory);
  }

  // Salva purchases no Firebase
  function savePurchases() {
    set(purchasesRef, purchases);
  }

  // Limpa todos os inputs
  function clearInputFields() {
    document.querySelectorAll('input').forEach(i => i.value = '');
  }


  // Cadastrar novo item no estoque
  function addItem() {
    const code = document.getElementById('productCode').value.trim();
    const name = document.getElementById('productName').value.trim();
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!code || !name || isNaN(quantity) || quantity <= 0) {
      alert('Preencha todos os campos corretamente para cadastrar o item.');
      return;
    }

    if (inventory.find(i => i.code === code)) {
      alert('Produto já cadastrado. Use "Adicionar ao Estoque" para aumentar a quantidade.');
      clearInputFields();
      return;
    }

    inventory.push({ code, name, quantity });
    saveInventory();
    updateInventoryTable();
    clearInputFields();
  }

  // Adiciona estoque existente
  function addStock() {
    const code = document.getElementById('productCode').value.trim();
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!code || isNaN(quantity) || quantity <= 0) {
      alert('Informe código e quantidade válidos para adicionar ao estoque.');
      return;
    }

    const item = inventory.find(item => item.code === code);
    if (!item) {
      alert('Produto não encontrado no estoque.');
      clearInputFields();
      return;
    }

    item.quantity += quantity;
    saveInventory();
    updateInventoryTable();
    clearInputFields();
  }

  // Remove quantidade do estoque
  function removeStock() {
    const code = document.getElementById('productCode').value.trim();
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!code || isNaN(quantity) || quantity <= 0) {
      alert('Informe código e quantidade válidos para retirar do estoque.');
      return;
    }

    const item = inventory.find(i => i.code === code);
    if (!item) {
      alert('Produto não encontrado no estoque.');
      clearInputFields();
      return;
    }

    if (item.quantity < quantity) {
      alert('Quantidade insuficiente no estoque.');
      clearInputFields();
      return;
    }

    item.quantity -= quantity;
    saveInventory();
    updateInventoryTable();
    clearInputFields();
  }

  // Solicitar compra
  function requestPurchase() {
    const code = document.getElementById('purchaseProductCode').value.trim();
    const name = document.getElementById('purchaseProductName').value.trim();
    const quantity = parseInt(document.getElementById('purchaseQuantity').value);

    if (!code || !name || isNaN(quantity) || quantity <= 0) {
      alert('Preencha todos os campos corretamente para solicitar compra.');
      return;
    }

    purchases.push({ code, name, quantity });
    savePurchases();
    updatePurchaseTable();
    clearInputFields();
  }

  // Dar baixa na solicitação de compra (adiciona ao estoque)
  function darBaixa(index) {
    const purchase = purchases[index];
    if (!purchase) return;

    const item = inventory.find(i => i.code === purchase.code);

    if (item) {
      item.quantity += purchase.quantity;
    } else {
      inventory.push({
        code: purchase.code,
        name: purchase.name,
        quantity: purchase.quantity
      });
    }

    purchases.splice(index, 1);
    saveInventory();
    savePurchases();
    updateInventoryTable();
    updatePurchaseTable();
  }

  // Remove produto do inventário
  function removeProduct(index) {
    if (confirm('Deseja realmente remover este produto do estoque?')) {
      inventory.splice(index, 1);
      saveInventory();
      updateInventoryTable();
    }
  }

  // Preenche automaticamente o nome do produto baseado no código do estoque
  function autoFillNameByCode(inputId, nameId) {
    const codeInput = document.getElementById(inputId);
    const nameInput = document.getElementById(nameId);

    codeInput.addEventListener('input', () => {
      const code = codeInput.value.trim();
      if (!code) {
        nameInput.value = '';
        return;
      }
     const item = inventory.find(i => i.code === code);
      nameInput.value = item ? item.name : '';
    });
  }

  // Lê dados do Firebase e atualiza as tabelas e arrays locais
  onValue(inventoryRef, (snapshot) => {
    inventory = snapshot.val() || [];
    updateInventoryTable();
  });

  onValue(purchasesRef, (snapshot) => {
    purchases = snapshot.val() || [];
    updatePurchaseTable();
  });

  
  const retiradasRef = ref(db, 'retiradas');
  let retiradas = [];

  function saveRetiradas() {
    set(retiradasRef, retiradas);
  }

  function confirmarRetirada() {
    const responsavel = document.getElementById("responsavelRetirada").value.trim();
    const setor = document.getElementById("setorRetirada").value.trim();
    const motivo = document.getElementById("motivoRetirada").value.trim();

    const code = document.getElementById("productCode").value.trim();
    const quantity = parseInt(document.getElementById("productQuantity").value);

    if (!responsavel || !setor || !motivo || !code || isNaN(quantity) || quantity <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const item = inventory.find(i => i.code === code);
    if (!item) {
      alert("Produto não encontrado.");
      return;
    }

    if (item.quantity < quantity) {
      alert("Estoque insuficiente.");
      return;
    }

    item.quantity -= quantity;
    saveInventory();
    updateInventoryTable();

    const retirada = {
      responsavel,
      setor,
      motivo,
      code,
      name: item.name,
      quantity,
      timestamp: new Date().toLocaleString()
    };

    retiradas.push(retirada);
    saveRetiradas();

    fecharModal();
    document.getElementById("responsavelRetirada").value = '';
    document.getElementById("setorRetirada").value = '';
    document.getElementById("motivoRetirada").value = '';
    clearInputFields();
  }

  function updateRetiradaTable() {
    const tableBody = document.getElementById('retiradaTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const setorFiltro = document.getElementById("filtroSetor").value.trim().toLowerCase();
    const dataInicio = document.getElementById("filtroDataInicio").value;
    const dataFim = document.getElementById("filtroDataFim").value;

    retiradas
      .filter(retirada => {
        const setorMatch = !setorFiltro || retirada.setor.toLowerCase().includes(setorFiltro);
        const data = new Date(retirada.timestamp.split(' ')[0].split('/').reverse().join('-'));
        const inicio = dataInicio ? new Date(dataInicio) : null;
        const fim = dataFim ? new Date(dataFim) : null;
        const dataMatch = (!inicio || data >= inicio) && (!fim || data <= fim);
        return setorMatch && dataMatch;
      })
      .forEach(retirada => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = retirada.timestamp;
        row.insertCell(1).textContent = retirada.code;
        row.insertCell(2).textContent = retirada.name;
        row.insertCell(3).textContent = retirada.quantity;
        row.insertCell(4).textContent = retirada.responsavel;
        row.insertCell(5).textContent = retirada.setor;
        row.insertCell(6).textContent = retirada.motivo;
      });
  }

  onValue(retiradasRef, (snapshot) => {
    retiradas = snapshot.val() || [];
    updateRetiradaTable();
  });


  
  let codigoParaRemocao = null;

  function solicitarRemocao(code) {
    codigoParaRemocao = code;
    document.getElementById("confirmRemoveModal").style.display = "flex";
  }

  function fecharModalRemocao() {
    codigoParaRemocao = null;
    document.getElementById("confirmRemoveModal").style.display = "none";
  }

  function confirmarRemocao() {
    if (!codigoParaRemocao) return;
    const index = inventory.findIndex(item => item.code === codigoParaRemocao);
    if (index !== -1) {
      inventory.splice(index, 1);
      saveInventory();
      updateInventoryTable(document.getElementById('filterInput').value);
    }
    fecharModalRemocao();
  }

  window.solicitarRemocao = solicitarRemocao;
  window.fecharModalRemocao = fecharModalRemocao;
  window.confirmarRemocao = confirmarRemocao;

  window.openTab = (evt, tabName) => {
    document.querySelectorAll(".tabcontent").forEach(tc => tc.classList.remove("active"));
    document.querySelectorAll(".tablinks").forEach(tl => tl.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
  };

  window.onload = () => {
    autoFillNameByCode('productCode', 'productName');
    autoFillNameByCode('purchaseProductCode', 'purchaseProductName');
    // As tabelas serão atualizadas automaticamente ao ler do Firebase via onValue
  };

  // Exportar funções para usar nos botões inline (já que script é módulo)
  window.addItem = addItem;
  window.addStock = addStock;
  window.removeStock = removeStock;
  window.requestPurchase = requestPurchase;
  window.darBaixa = darBaixa;
  window.removeProduct = removeProduct;

  function abrirModalRetirada() {
    document.getElementById("retiradaModal").style.display = "flex";
  }

  function fecharModal() {
    document.getElementById("retiradaModal").style.display = "none";
  }

  function aplicarFiltrosRetirada() {
    updateRetiradaTable();
  }

  function limparFiltrosRetirada() {
    document.getElementById("filtroSetor").value = "";
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";
    updateRetiradaTable();
  }

  window.abrirModalRetirada = abrirModalRetirada;
  window.fecharModal = fecharModal;
  window.confirmarRetirada = confirmarRetirada;
  window.aplicarFiltrosRetirada = aplicarFiltrosRetirada;
  window.limparFiltrosRetirada = limparFiltrosRetirada;
