# Plano: Maze Generator standalone

## Objetivo

Entregar uma página HTML única, portátil e autocontida para criar, visualizar, resolver e exportar labirintos. A experiência visual deve aproveitar a estrutura da interface de `sample HTML UI.html`: painel de configurações bem organizado, área de trabalho destacada, controles responsivos, estados visuais claros e impressão limpa.

## Entrega principal

- `maze-generator-standalone.html`
  - Documento completo com `doctype`, metadados, favicon inline, CSS inline e JavaScript inline.
  - Nenhum `<script src>`, `<link>` externo, fonte remota, biblioteca ou chamada de rede.
  - Pode ser aberto diretamente com `file://`, hospedado em qualquer servidor estático ou incorporado como um arquivo independente.
- `PLAN.md`
  - Este plano registra o escopo, as decisões de UX, os recursos e os critérios de aceitação.

## Arquitetura da página

### Painel de configurações

O painel lateral segue o padrão visual da interface de referência:

1. Identidade visual com ícone inline e título.
2. Dimensões:
   - colunas e linhas;
   - espessura das paredes;
   - limites seguros de 3 a 80 células.
3. Percurso:
   - entradas diagonal, horizontal, vertical ou nenhuma;
   - tendência de geração aleatória, horizontal ou vertical;
   - aberturas extras para produzir múltiplos caminhos.
4. Ícones:
   - seleção independente para entrada e saída;
   - bandeira, círculo, estrela, casa, seta, troféu, diamante, brilho ou ausência de ícone.
5. Aparência:
   - cor das paredes, da solução, do fundo e dos ícones;
   - fundos sólido, gradiente, grade, pontos e papel;
   - temas rápidos Oceano, Floresta, Ameixa e Noite.
6. Ações:
   - gerar;
   - resolver;
   - limpar rota;
   - baixar PNG;
   - imprimir.

### Área de trabalho

- Canvas com desenho nítido e redimensionamento responsivo.
- Cartão visual com fundo discreto, sombra e grade auxiliar.
- Indicador de estado: pronto, gerado, rota encontrada, rota limpa ou sem rota.
- Estatísticas de dimensão, passos da rota, aberturas efetivamente criadas e tempo de geração.
- Em impressão, o painel e os elementos de controle são ocultados e somente o labirinto é impresso.

## Lógica funcional

### Geração

- Usar recursive backtracking iterativo, evitando recursão profunda em labirintos grandes.
- Representar paredes e corredores em uma matriz de caracteres numéricos.
- Aplicar tendência horizontal ou vertical somente como preferência de escolha, mantendo a aleatoriedade.
- Adicionar aberturas extras apenas em paredes que conectam corredores existentes.
- Garantir que o labirinto base permaneça conectado.

### Entradas, saída e solução

- Calcular posições válidas para os quatro modos de entrada.
- Desenhar ícones sobre as células de entrada e saída sem dependências externas.
- Resolver com busca em largura para obter uma rota curta em quantidade de células.
- Destacar a rota com a cor configurada.
- Expor uma ação para remover o destaque sem gerar um novo labirinto.

### Persistência

- Salvar configurações no `localStorage` com chave própria.
- Tratar `localStorage` indisponível ou bloqueado sem impedir a utilização.
- Restaurar as preferências antes da primeira geração.
- Atualizar valores de saída dos controles durante alterações.

### Exportação

- Baixar o canvas como `maze.png`.
- Imprimir uma versão limpa por meio de `window.print()` e CSS `@media print`.
- Manter o arquivo gerado independente de links ou recursos externos.

## Acessibilidade e responsividade

- Labels associados aos controles.
- `aria-label` no canvas, nos temas e nos ícones.
- Botões com áreas de toque confortáveis.
- Foco visível em campos.
- Contraste suficiente para textos, estados e ações.
- Layout em coluna no celular e painel lateral em telas amplas.
- Uso de `env(safe-area-inset-*)` para dispositivos com recortes.
- Ícones decorativos em SVG com `aria-hidden` quando apropriado.

## Decisões de escopo

- A implementação standalone não substitui nem remove a versão modular existente em `src/`.
- A geração acontece no cliente, portanto não há servidor, endpoint ou armazenamento remoto.
- A exportação inicial é PNG e impressão; SVG e JSON podem ser adicionados em uma iteração posterior.
- Os ícones usam caracteres Unicode para permanecerem disponíveis sem baixar fontes; o ícone da marca usa SVG inline.
- O limite de 80 × 80 equilibra portabilidade, legibilidade no canvas e tempo de processamento em dispositivos móveis.

## Critérios de aceitação

- [x] Abrir diretamente o arquivo standalone sem conexão de rede.
- [x] Gerar labirintos em dimensões configuráveis.
- [x] Usar entradas e saídas personalizadas.
- [x] Exibir diferentes fundos e temas.
- [x] Alterar cores de paredes, fundo, solução e ícones.
- [x] Resolver e limpar uma rota.
- [x] Baixar PNG e imprimir.
- [x] Persistir configurações localmente quando possível.
- [x] Funcionar em desktop e telas estreitas.
- [x] Manter todo o código da nova experiência em um único HTML.

## Validação prevista

1. Verificar que o documento contém todos os estilos e scripts inline.
2. Abrir o arquivo em navegador local e confirmar geração inicial.
3. Testar alterações de dimensões, tema, fundo, ícones, cores e tendência.
4. Testar solução com e sem aberturas extras.
5. Testar download PNG, impressão e restauração após recarregar.
6. Confirmar que não existem requisições de rede ou dependências externas.
