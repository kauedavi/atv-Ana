const dishes = [
  {
    name: "IELA",
    description:
      "O projeto Indígena Digital, desenvolvido pelo IELA/UFSC, busca promover a inclusão digital dos povos indígenas por meio de capacitação tecnológica. A iniciativa oferece ferramentas e conhecimento para que essas comunidades possam utilizar recursos digitais de forma autônoma, ampliando sua participação no mundo conectado.",
    preco: 30,
    img: "https://i.pinimg.com/736x/38/92/13/38921351a3d0956e026eef63a7fa5300.jpg",
  },
  {
    name: "Conexão dos Povos da Floresta",
    description:
      "Este projeto leva acesso à internet para mais de mil comunidades tradicionais na Amazônia, possibilitando inclusão digital e comunicação. A iniciativa fortalece a integração entre povos indígenas e o mundo digital, garantindo oportunidades de educação, informação e defesa de direitos.",
    preco: 35,
    img: "https://i.pinimg.com/736x/b7/32/84/b732847d2b6dba5ec3f7a43199704574.jpg",
  },
  {
    name: "FSC",
    description:
      "A FSC Indigenous Foundation atua globalmente para fortalecer a voz e os direitos dos povos indígenas. Seu trabalho inclui a promoção da valorização cultural, proteção territorial e apoio a projetos que garantem autonomia e sustentabilidade para comunidades indígenas em diferentes regiões do mundo.",
    preco: 20,
    img: "https://i.pinimg.com/736x/ef/d1/ab/efd1ab4b55f460cd93a174e139a0da96.jpg",
  },
  {
    name: "ANAÍ",
    description:
      "A ANAÍ tem como propósito garantir os direitos e a autonomia dos povos indígenas, especialmente em um cenário de desafios crescentes relacionados à demarcação de terras, preservação ambiental e inclusão social. A organização atua para fortalecer lideranças indígenas, promover educação diferenciada e ampliar a participação das comunidades em políticas públicas.",
    preco: 25,
    img: "https://i.pinimg.com/1200x/7e/3a/4f/7e3a4f62c8a9f17e31d177d8e2ebf764.jpg",
  },
];
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const dishName = document.querySelector(".dish-name");
const dishDescription = document.querySelector(".dish-description");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
let currentIndex = 0;
let isAnimating = false;
let carrinho = []; // Array para itens selecionados

function updateCarousel(newIndex) {
  if (isAnimating) return;
  isAnimating = true;
  currentIndex = (newIndex + cards.length) % cards.length;
  cards.forEach((card, i) => {
    const offset = (i - currentIndex + cards.length) % cards.length;
    card.classList.remove(
      "center",
      "left-1",
      "left-2",
      "right-1",
      "right-2",
      "hidden"
    );
    if (offset === 0) {
      card.classList.add("center");
    } else if (offset === 1) {
      card.classList.add("right-1");
    } else if (offset === 2) {
      card.classList.add("right-2");
    } else if (offset === cards.length - 1) {
      card.classList.add("left-1");
    } else if (offset === cards.length - 2) {
      card.classList.add("left-2");
    } else {
      card.classList.add("hidden");
    }
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
  dishName.style.opacity = "0";
  dishDescription.style.opacity = "0";
  setTimeout(() => {
    dishName.textContent = dishes[currentIndex].name;
    dishDescription.textContent = dishes[currentIndex].description;
    dishName.style.opacity = "1";
    dishDescription.style.opacity = "1";
  }, 300);
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

leftArrow.addEventListener("click", () => {
  updateCarousel(currentIndex - 1);
});
rightArrow.addEventListener("click", () => {
  updateCarousel(currentIndex + 1);
});
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    updateCarousel(i);
  });
});
cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    updateCarousel(i);
    // Ao clicar no carrossel, abre cardápio e adiciona o item automaticamente
    adicionarAoCarrinho(dishes[i]);
    abrirCardapio();
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    updateCarousel(currentIndex - 1);
  } else if (e.key === "ArrowRight") {
    updateCarousel(currentIndex + 1);
  }
});
let touchStartX = 0;
let touchEndX = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});
function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      updateCarousel(currentIndex + 1);
    } else {
      updateCarousel(currentIndex - 1);
    }
  }
}
updateCarousel(0);

// Funções novas para cardápio e carrinho
function abrirCardapio() {
  const cardapioDiv = document.getElementById("cardapio");
  const carrinhoDiv = document.getElementById("pedidos-selecionados");
  cardapioDiv.style.display = "block";
  if (carrinho.length > 0) {
    carrinhoDiv.style.display = "block";
  }
  gerarCardsCardapio(); // Gera os cards uma vez ao abrir
}

function gerarCardsCardapio() {
  const grid = document.querySelector(".cardapio-grid");
  if (grid.innerHTML) return; // Gera só uma vez
  dishes.forEach((dish, index) => {
    const card = document.createElement("div");
    card.classList.add("cardapio-card");
    card.innerHTML = `
      <img src="${dish.img}" alt="${dish.name}">
      <h3>${dish.name}</h3>
      <p>R$ ${dish.preco.toFixed(2)}</p>
      <button class="btn btn-gold" onclick="adicionarAoCarrinho(dishes[${index}])">Adicionar</button>
    `;
    grid.appendChild(card);
  });
}

function adicionarAoCarrinho(dish) {
  const existente = carrinho.find((item) => item.name === dish.name);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...dish, quantidade: 1 });
  }
  atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
  const grid = document.querySelector(".carrinho-grid");
  grid.innerHTML = "";
  carrinho.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("carrinho-card");
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(
      item.preco * item.quantidade
    ).toFixed(2)}</p>
      <button class="btn btn-gold" onclick="mudarQuantidade(${index}, 1)">+</button>
      <button class="btn btn-red" onclick="mudarQuantidade(${index}, -1)">-</button>
    `;
    grid.appendChild(card);
  });
  document.getElementById("pedidos-selecionados").style.display = "block";
}

function mudarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade < 1) {
    carrinho.splice(index, 1);
  }
  atualizarCarrinhoUI();
}

async function enviarPedido() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio! Adicione itens antes de enviar.");
    return;
  }
  const total = carrinho.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );
  const pedido = {
    pedidos: carrinho.map((item) => ({
      nome: item.name,
      quantidade: item.quantidade,
      preco: item.preco,
    })),
    total: total,
  };
  try {
    const res = await fetch(`${baseURL}/pedido`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
      credentials: "include",
    });
    const text = await res.text();
    alert(text);
    if (res.ok) {
      carrinho = []; // Esvazia carrinho
      atualizarCarrinhoUI();
      document.getElementById("pedidos-selecionados").style.display = "none";
    }
  } catch (err) {
    alert("Erro ao enviar pedido: " + err);
  }
}

// Exposição global para botão opcional
window.abrirCardapio = abrirCardapio;
