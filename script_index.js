const data = [
  {
    logo: "ICON/clipboard.png",
    title: "ANÁLISE CRÍTICA",
    subTitle: "PPAP",
    descprition:
      "Informações sobre o desenvolvimento de PPAP, suas Etapas e seus Status.",
    apiLink: "https://hunter.io/api-documentation/v2"
  },
  {
    logo: "ICON/dispositivo.png",
    title: "DISPOSITIVOS",
    subTitle: "DM e GM",
    descprition:
      "Informações sobre o andamento dos Dispositivos e Gabaritos.",
    apiLink: "https://asana.com/developers"
  },
  {
    logo: "ICON/ferramentaria.png",
    title: "FERRAMENTARIA",
    subTitle: "Estoque",
    descprition:
      "Informações sobre o Estoque da Ferramentaria.",
    apiLink: "PAGES/FERRAMENTARIA - ESTOQUE.html"
  },
  {
    logo: "ICON/melhoria.png",
    title: "MELHORIAS",
    subTitle: "Processo",
    descprition: "Informações sobre as Melhorias de Processos.",
    apiLink: "https://api.met.no/weatherapi/documentation"
  },
  {
    logo: "ICON/norma.png",
    title: "NORMAS",
    subTitle: "Qualidade",
    descprition:
      "Informações sobre as Normas de Qualidade de nossos principais Clientes. ",
    apiLink:
      "https://developer.mailchimp.com/documentation/mailchimp/reference/overview/"
  },
  {
    logo: "ICON/book.png",
    title: "APOSTILAS",
    subTitle: "Informações",
    descprition:
      "Informações de processos, para facilitar compreensão e desenvolvimentos futuros.",
    apiLink: "https://stripe.com/docs/api"
  },
];

document.getElementById("allCardsContainer").innerHTML = data
  .map(
    (eachCard) =>
      `
    <div class="eachCard">
    <div class="cardContent">
        <div class="cardImage">
            <img src="${eachCard.logo}" alt="${eachCard.title}-logo">
        </div>
        <div class="cardInfo">
            <h2 class="cardTitle">${eachCard.title}</h2>
        <span class="cardSubTitle">${eachCard.subTitle}</span>
        <p class="cardText">${eachCard.descprition}</p>
        </div>
    </div>
    <div class="userActions">
        <button class="btn-secondary"><svg width="1em" height="1em" viewBox="0 0 16 16"
                class="bi bi-bookmark" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
            </svg> Bookmark</button>
        <button class="btn-primary">
            <a href="${eachCard.apiLink}" target="_blank" rel="noopener noreferrer">API Docs</a> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right"
                fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
        </button>
    </div>
    </div>
    `
  )
  .join("");
