-- Active: 1698437856774@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    )

CREATE TABLE
    posts (
        id PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL,
        dislikes INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )

CREATE TABLE
    likes_dislakes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
    )

INSERT INTO users
VALUES (
        'u001',
        'Layla',
        'layla@gmail.com',
        'Layla@123',
        'user',
        '27-10-2023 17:57:01'
    ), (
        'u002',
        'Lily',
        'lily@gmail.com',
        'Lily@123',
        'user',
        '27-10-2023 17:57:02'
    )

INSERT INTO posts
VALUES (
        'p001',
        'u001',
        'My first post',
        1,
        2,
        '27-10-2023 17:57:01',
        '27-10-2023 17:57:11'
    ), (
        'p002',
        'u002',
        'My second post',
        1,
        2,
        '27-10-2023 17:57:02',
        '27-10-2023 17:57:22'
    )

DROP TABLE users;

DROP TABLE posts;

DROP TABLE likes_dislakes;