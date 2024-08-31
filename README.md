# Projeto de Integração com a API Gemini

Este projeto é uma API desenvolvida para integrar com o serviço Gemini, que fornece medidas de imagens. O propósito principal é demonstrar a integração com uma API externa, manipulação de erros e criação de testes automatizados para garantir a robustez do serviço.

## Descrição do Projeto

O projeto envolve a criação de um serviço que utiliza a API Gemini para extrair medidas de imagens enviadas em formato base64. O serviço é construído utilizando o `axios` para fazer requisições HTTP e o `jest` para testes.

### Funcionalidade

O serviço `extractMeasureFromImage` realiza as seguintes ações:

1. **Envio da Imagem**: Envia uma imagem em formato base64 para a API Gemini.
2. **Recepção da Resposta**: Recebe e processa a resposta da API, que inclui a URL da imagem, o UUID da medida e o valor da medida.
3. **Tratamento de Erros**: Trata erros específicos retornados pela API Gemini e erros de comunicação com o servidor.

## Configuração

### Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados.

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/username/repository.git
    cd repository
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e adicione a seguinte variável:

    ```bash
    GEMINI_API_KEY=your_gemini_api_key
    ```

## Testes Automatizados

Os testes automatizados são escritos com `jest` e garantem que o serviço `extractMeasureFromImage` funcione conforme esperado. Eles cobrem cenários de sucesso e vários tipos de falhas.

### Execução dos Testes

Para executar os testes, use o seguinte comando:

```bash
npm test
