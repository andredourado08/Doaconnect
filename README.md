# Doaconnect

Doaconnect é um site informativo para ajudar moradores de São José do Rio Preto a encontrar pontos de doação. A proposta é facilitar o acesso a locais que recebem roupas, alimentos, itens de higiene, brinquedos, móveis e outros tipos de apoio social.

O projeto foi criado com foco em simplicidade, consulta rápida e impacto social.

Funcionalidades
Lista de pontos de doação em São José do Rio Preto
Filtros por categoria de item
Busca por bairro, endereço, ponto ou tipo de doação
Cards com endereço, horário, contato, itens aceitos e fonte
Botão para abrir a rota do local no Google Maps
Seção com cuidados antes de doar
Modo claro e modo escuro
Layout responsivo para computador, tablet e celular
Logo e favicon personalizados do Doaconnect
Tecnologias usadas
HTML5
CSS3
JavaScript
Font Awesome
AOS Animation Library
Estrutura do projeto
Doaconnect/
├── index.html
└── assets/
    ├── css/
    │   ├── main.css
    │   └── responsive.css
    ├── data/
    │   └── donation-points.js
    ├── img/
    │   ├── doaconnect-logo-mark.png
    │   └── favicon.png
    └── js/
        └── app.js
Como abrir o site
Como o projeto é estático, basta abrir o arquivo index.html no navegador.

Também é possível publicar o site em serviços como GitHub Pages, Vercel ou Netlify enviando o index.html e a pasta assets.

Como atualizar os pontos de doação
Os pontos ficam no arquivo:

assets/data/donation-points.js
Cada ponto segue este formato:

{
  id: "nome-do-ponto",
  type: "roupas",
  categories: ["roupas", "brinquedos"],
  title: "Nome do ponto de doação",
  desc: "Descrição curta sobre o local.",
  location: "Bairro",
  address: "Endereço completo",
  hours: "Horário de atendimento",
  contact: "Telefone ou WhatsApp",
  accepts: ["Roupas", "Calçados", "Brinquedos"],
  lastChecked: "Maio de 2026",
  mapUrl: "Link do Google Maps",
  sourceUrl: "Link da fonte oficial"
}
Depois de alterar os dados, salve o arquivo e atualize a página no navegador.

Categorias disponíveis
Geral
Roupas
Alimentos
Higiene
Brinquedos
Saúde
Móveis
Observação importante
As informações dos pontos de doação podem mudar. Antes de levar uma doação, confirme o horário, os itens aceitos e o endereço diretamente com o local.

Créditos
Projeto Doaconnect - iniciativa escolar de impacto social.

Site desenvolvido por KD-Solutions.
