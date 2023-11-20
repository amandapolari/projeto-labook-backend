# Projeto Labook

## Índice

-   [1. Resumo do Projeto](#resumo-do-projeto)
-   [2. Tecnologias e Conteúdos Utilizados](#tecnologias-e-conteúdos-utilizados)
-   [3. Banco de Dados](#banco-de-dados)
-   [4. Instalação](#instalação)
-   [5. Inicialização](#inicialização)
-   [6. Endpoints](#endpoints)
    -   [Signup](#signup)
    -   [Login](#login)
    -   [Create Post](#create-post)
    -   [Get Posts](#get-posts)
    -   [Edit Post](#edit-post)
    -   [Delete Post](#delete-post)
    -   [Like/Dislike Post](#like-or-dislike-post)
-   [7. Tratamento de Erros](#tratamento-de-erros)
-   [8. Lista de Requisitos do Projeto](#lista-de-requisitos-do-projeto)
-   [9. Desenvolvedora](#desenvolvedora)

## Resumo do Projeto

[🔼](#índice)

O Labook é uma plataforma de rede social que permite a interação entre os usuários. Ao se cadastrar e logar na plataforma, os usuários têm a capacidade de criar e curtir postagens.

A plataforma oferece uma variedade de recursos e funcionalidades que incluem:

-   **Cadastro de Usuários**: Através do processo de cadastro, os usuários podem criar suas contas na plataforma, fornecendo informações pessoais básicas, como nome, endereço de e-mail e senha.

-   **Criação de Postagens**: Os membros do Labook têm a capacidade de compartilhar suas ideias, pensamentos e experiências por meio de postagens.

-   **Likes e Deslikes**: Os usuários podem "curtir" ou "descurtir" postagens de outros membros, permitindo uma variedade de interações e opiniões sobre o conteúdo compartilhado.

-   **Gerenciamento de Postagens**: Os criadores de postagens têm controle total sobre seu conteúdo, podendo editá-lo ou excluí-lo conforme necessário.

-   **Recursos de Segurança**: Para garantir a segurança e privacidade dos usuários, o Labook implementa medidas de segurança, como senhas criptografadas e autenticação por meio de tokens JWT.

## Tecnologias e conteúdos utilizados

[🔼](#índice)

-   NodeJS
-   Typescript
-   Express
-   SQL e SQLite
-   Knex
-   POO
-   Arquitetura em camadas
-   Geração de UUID
-   Geração de hashes
-   Autenticação e Autorização
-   Roteamento
-   Postman

## Banco de dados

[🔼](#índice)

As entidades do banco de dados estão estruturadas da seguinte forma:

![Bando de dados no dbdiagrama.io](image.png)

Clique [aqui](https://dbdiagram.io/d/63d16443296d97641d7c1ae1) para conferir o site com a estrutura do banco de dados.

## Instalação

[🔼](#índice)

### Pré-requisitos:

Ter instalado o `node.js` e o `npm` .

### Instalações necessárias:

```bash
npm install
```

## Inicialização

[🔼](#índice)

Para rodar o servidor localmente digite o seguinte comando:

```bash
npm run dev
```

## Endpoints

[🔼](#índice)

Clique [**AQUI**](https://documenter.getpostman.com/view/28316385/2s9Ye8fuWG) para visualizar a documentação da [API LABOOK](https://documenter.getpostman.com/view/28316385/2s9Ye8fuWG).

A base URL para esta API é **`http://localhost:3003`**

Os endpoints estão divididos em pastas de acordo com o que é gerenciado.
A API fornece os seguintes endpoints:

## Exemplos de requisição

### Signup

[🔼](#índice)

-   Endpoint público
-   Método HTTP: POST
-   Descrição: Cria um novo usuário.
-   Enviar via body: `name`, `email` e `password`

**INPUT:**

```json
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**OUTPUT:**

```json
{
    "message": "Usuário criado com sucesso",
    "token": "token_de_autenticação"
}
```

### Login

[🔼](#índice)

-   Endpoint público
-   Método HTTP: POST
-   Descrição: Realiza o login do usuário.
-   Enviar via body: email e password

**INPUT:**

```json
{
    "email": "usuario@email.com",
    "password": "senha123"
}
```

**OUTPUT:**

```json
{
    "message": "Login realizado com sucesso",
    "token": "token_de_autenticação"
}
```

### Create post

[🔼](#índice)

-   Endpoint privado
-   Método HTTP: POST
-   Descrição: Cria um novo post.
-   Enviar via headers um Authorization: `token`
-   Enviar via body: `content`

**INPUT:**

```json
// headers.authorization = "token"

// body:
{
    "content": "Mais um post para a comunidade!"
}
```

**OUTPUT:**

```json
{
    "message": "Post criado com sucesso",
    "content": "Mais um post para a comunidade!"
}
```

### Get posts

[🔼](#índice)

-   Endpoint privado
-   Método HTTP: GET
-   Descrição: Recupera uma lista de todos os usuários cadastrados no sistema.
-   Enviar via headers um Authorization: `token`

**INPUT:**

```json
// headers.authorization = "token"
```

**OUTPUT:**

```json
[
    {
        "id": "0e3f6d82-ec45-4c81-8ecb-ac7aac044b50",
        "content": "O sem-coroa há de reinar!",
        "likes": 1,
        "dislikes": 0,
        "createdAt": "19-11-2023 12:47:07",
        "updatedAt": "19-11-2023 12:47:07",
        "creator": {
            "id": "8b4d95ab-0b13-4092-8661-0b29bfa46830",
            "name": "Luan"
        }
    },
    {
        "id": "5153f8a9-a449-424c-89a4-981dd5c1ce9f",
        "content": "Pode parar de nadar agora, Lily. Finalmente chegamos à costa",
        "likes": 0,
        "dislikes": 1,
        "createdAt": "19-11-2023 13:29:20",
        "updatedAt": "19-11-2023 13:34:13",
        "creator": {
            "id": "527348d8-434d-4243-b5c9-927d8e96b418",
            "name": "Atlas"
        }
    }
]
```

### Edit post

[🔼](#índice)

-   Endpoint privado
-   Método HTTP: PUT
-   Descrição: Edita o conteúdo de um post existente.
-   Enviar via params: `id` do post
-   Enviar via headers um Authorization: `token`
-   Enviar via body: `newContext`

**INPUT:**

```json
// params :id

// headers.authorization = "token"

// body:
{
    "newContext": "Texto editado do post"
}
```

**OUTPUT:**

```json
{
    "message": "Post atualizado com sucesso",
    "content": "Texto editado do post"
}
```

---

## CONTINUAR A DESCREVER OS ENDPOINTS DAQUI SÓ FALTA O DELETE E O LIKE E DISLIKE

### Delete post

[🔼](#índice)

-   Endpoint privado
-   Método HTTP: DELETE
-   Descrição: Deleta um post criado por você.
-   Enviar via params: id
-   Enviar via headers: Authorization

```json
// params :id

// headers.authorization = "token"
```

**OUTPUT:**

```json
{
    "message": "Post deletado com sucesso"
}
```

### Like or dislike post

[🔼](#índice)

-   Endpoint privado
-   Método HTTP: PUT
-   Descrição: Dá like ou dislike em um post que não foi criado por você.
-   Enviar via params: id
-   Enviar via headers: Authorization
-   Enviar via body: like (true para like, false para dislike)

**INPUT:**

**like**

```json
{
    "like": true
}
```

**dislike**

```json
{
    "like": false
}
```

## Lista de requisitos do projeto

[🔼](#índice)

-   Documentação

    -   [ ] Documentação Postman de todos os endpoints (obrigatória para correção)

-   Endpoints

    -   [ ] signup
    -   [ ] login
    -   [ ] create post
    -   [ ] get posts
    -   [ ] edit post
    -   [ ] delete post
    -   [ ] like / dislike post

-   Autenticação e Autorização

    -   [ ] identificação UUID
    -   [ ] senhas hasheadas com Bcrypt
    -   [ ] tokens JWT

-   Código

    -   [ ] POO
    -   [ ] Arquitetura em camadas
    -   [ ] Roteadores no Express

-   README.md

    -   [ ] Criar Readme

## Tratamento de Erros

[🔼](#índice)

O Labook implementa tratamento de erros para fornecer respostas adequadas em diferentes cenários. Abaixo estão alguns dos erros tratados no projeto:

### BadRequestError

-   **Código:** 400
-   **Descrição:** Indica que a requisição feita pelo cliente é inválida.

### NotFoundError

-   **Código:** 404
-   **Descrição:** Indica que o recurso solicitado não foi encontrado.

### Customização de Erros com Zod

Além disso, o Zod também pode ser utilizado para validar e customizar erros relacionados ao BadRequestError. Por exemplo, para o endpoint de signup:

```ts
// Uso do Zod para validação detalhada
export const SignupSchema = z
    .object({
        name: z
            .string({
                required_error: "'name' é obrigatório",
                invalid_type_error: "'name' deve ser do tipo string",
            })
            .min(2, "'name' deve possuir no mínimo 2 caracteres"),
        // ... outras validações ...
    })
    .transform((data) => data as SignupInputDTO);
```

O uso do Zod permite validar os dados recebidos de forma detalhada, gerando mensagens de erro específicas que contribuem para uma resposta mais informativa ao cliente.

## Desenvolvedora

[🔼](#índice)

Este projeto foi desenvolvido por:

**Amanda Polari** : [LinkedIn](https://www.linkedin.com/in/amandapolari/) | [GitHub](https://github.com/amandapolari)
