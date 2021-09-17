<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

Projeto simples com as seguintes tecnologias

* JWT
* Jest
* Redis (cache e queue)
* mailer
* Prisma
* Docker


## Getting Started

-- --

#### Create containers (Postgres, Redis)
```
 docker-compose up -d
```
#### Install dependencies
```
 npm ci 
```
#### Migrate database
```
 npx prisma migrate dev 
```
#### Seed database
```
 npm run seed 
```

#### Modo de desenvolvimento

```
 npm run start:dev 
```

#### Testes 
```
 npm run test 
```
#### Testes coverage

```
 npm run test:cov 
```

#### Testes watch

```
 npm run test:watch 
```



