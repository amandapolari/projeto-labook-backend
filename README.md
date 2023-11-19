# Projeto Labook

## Índice

-   [Resumo do Projeto](#resumo-do-projeto)
-   [Tecnologias e conteúdos utilizados](#tecnologias-e-conteúdos-utilizados)

## Resumo do Projeto

[🔼](#índice)

O Labook é uma plataforma de rede social que permite a interação entre os usuários. Ao se cadastrar na plataforma, os usuários têm a capacidade de criar e curtir postagens.

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
-   Autenticação e autorização
-   Roteamento
-   Postman

## Banco de dados

[🔼](#índice)

![projeto-labook (2)](https://user-images.githubusercontent.com/29845719/216036534-2b3dfb48-7782-411a-bffd-36245b78594e.png)

https://dbdiagram.io/d/63d16443296d97641d7c1ae1

## Lista de requisitos

[🔼](#índice)

-   Documentação Postman de todos os endpoints (obrigatória para correção)

-   Endpoints

    -   [ ] signup
    -   [ ] login
    -   [ ] create post
    -   [ ] get posts
    -   [ ] edit post
    -   [ ] delete post
    -   [ ] like / dislike post

-   Autenticação e autorização

    -   [ ] identificação UUID
    -   [ ] senhas hasheadas com Bcrypt
    -   [ ] tokens JWT

-   Código

    -   [ ] POO
    -   [ ] Arquitetura em camadas
    -   [ ] Roteadores no Express

-   README.md

## Token payload e User roles

[🔼](#índice)

O enum de roles e o payload do token JWT devem estar no seguinte formato:

```typescript
export enum USER_ROLES {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN',
}

export interface TokenPayload {
    id: string;
    name: string;
    role: USER_ROLES;
}
```

## Exemplos de requisição

### Signup

[🔼](#índice)

Endpoint público utilizado para cadastro. Devolve um token jwt.

```typescript
// request POST /users/signup
// body JSON
{
  "name": "Beltrana",
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 201 CREATED
{
  token: "um token jwt"
}
```

### Login

[🔼](#índice)

Endpoint público utilizado para login. Devolve um token jwt.

```typescript
// request POST /users/login
// body JSON
{
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 200 OK
{
  token: "um token jwt"
}
```

### Create post

[🔼](#índice)

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request POST /posts
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour!"
}

// response
// status 201 CREATED
```

### Get posts

[🔼](#índice)

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request GET /posts
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "uma uuid v4",
        "content": "Hoje vou estudar POO!",
        "likes": 2,
        "dislikes" 1,
        "createdAt": "2023-01-20T12:11:47:000Z"
        "updatedAt": "2023-01-20T12:11:47:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Fulano"
        }
    },
    {
        "id": "uma uuid v4",
        "content": "kkkkkkkkkrying",
        "likes": 0,
        "dislikes" 0,
        "createdAt": "2023-01-20T15:41:12:000Z"
        "updatedAt": "2023-01-20T15:49:55:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Ciclana"
        }
    }
]
```

### Edit post

[🔼](#índice)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.

```typescript
// request PUT /posts/:id
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour lá no point de sempre!"
}

// response
// status 200 OK
```

### Delete post

[🔼](#índice)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

-   garanta que ele continue funcionando depois de implementar o LIKE e DISLIKE!

```typescript
// request DELETE /posts/:id
// headers.authorization = "token jwt"

// response
// status 200 OK
```

### Like or dislike post (mesmo endpoint faz as duas coisas)

[🔼](#índice)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou o post não pode dar like ou dislike no mesmo.<br><br>
Caso dê um like em um post que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

#### Like (funcionalidade 1)

[🔼](#índice)

```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

#### Dislike (funcionalidade 2)

[🔼](#índice)

```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```

#### Para entender a tabela likes_dislikes

[🔼](#índice)

-   no SQLite, lógicas booleanas devem ser controladas via 0 e 1 (INTEGER)
-   quando like valer 1 na tabela é porque a pessoa deu like no post
    -   na requisição like é true
-   quando like valer 0 na tabela é porque a pessoa deu dislike no post
    -   na requisição like é false
-   caso não exista um registro na tabela de relação, é porque a pessoa não deu like nem dislike
-   caso dê like em um post que já tenha dado like, o like é removido (deleta o item da tabela)
-   caso dê dislike em um post que já tenha dado dislike, o dislike é removido (deleta o item da tabela)
