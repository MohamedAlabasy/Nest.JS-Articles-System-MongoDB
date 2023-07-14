<h1 align="center">Nest.JS Articles System</h1>

## Description:

The goal of the project is to create articles by users and comment or like them after they create an account for them in the application and confirm their account by email.  
Every person who created an article, comment or like can only edit or delete it whenever he wants.

## To run this project

`Step 1` : To use this project must install [Node.js](https://nodejs.org/en/), [Nest.Js](https://nestjs.com/) and [Mongodb](https://www.mongodb.com/try/download/community) Then Download the source code

```
git clone https://github.com/MohamedAlabasy/Nest.JS-Articles-System-MongoDB.git
```

`Step 2` : Enter the project file then install package

```
npm i
```

`Step 3` : Run server on watch mode :

```
npm run start:dev
```

`Step 4` : Open [postman](https://www.postman.com/downloads/) and import : [API Collation](https://github.com/MohamedAlabasy/Nest.JS-Articles-System-MongoDB/blob/main/api_collection.json) You will find it in the project file.

<h3 align="center">To help you understand the project </h3>

<!-- ## Folder Structure

```bash
├── src
│   ├── casl => `for casl`
│   │      ├── ability.factory.ts => `for handel what user can and cannot do`
│   │      └── ability.module.ts
│   │
│   │
│   ├── config => `for app configuration`
│   │      ├── mongodb.config.ts
│   │      ├── sendEmail.config.ts
│   │      └── token.config.ts
│   │
│   │
│   ├── middleware
│   │       ├── check-tokens.middleware.ts => `for check tokens on all requests`
│   │       └── logger.middleware.middleware.ts => `for log url, method and statue of requests`
│   │
│   │
│   │── articles => `for handel articles code`
│   │     ├── dto => `for handel data transfer object for articles`
│   │     ├── schema => `for articles schema`
│   │     ├── articles.controller.ts => `for handel articles functions and routes (endpoints)`
│   │     ├── articles.module.ts => `for handel articles Models`
│   │     └── articles.service.ts => `for handel articles database connection and query`
│   │
│   │── comments => `for handel comments code`
│   │     ├── dto
│   │     ├── schema
│   │     ├── comments.controller.ts
│   │     ├── comments.module.ts
│   │     └── comments.service.ts
│   │
│   │── email-verification => `for handel email-verification code`
│   │     ├── dto
│   │     ├── schema
│   │     ├── email-verification.module.ts
│   │     └── email-verification.service.ts
│   │
│   │── forgot-password => `for handel forgot-password code`
│   │     ├── dto
│   │     ├── schema
│   │     ├── forgot-password.controller.ts
│   │     ├── forgot-password.module.ts
│   │     └── forgot-password.service.ts
│   │
│   │── likes => `for handel likes code`
│   │     ├── dto
│   │     ├── schema
│   │     ├── likes.controller.ts
│   │     ├── likes.module.ts
│   │     └── likes.service.ts
│   │
│   │── users => `for handel users code`
│   │      ├── dto
│   │      ├── schema
│   │      ├── users.controller.ts
│   │      ├── users.module.ts
│   │      └── users.service.ts
│   │
│   │
│   ├── pipes => `for handel custom pipe`
│   │     ├── email-lower-case.pipe.ts
│   │     ├── hash-password.pipe.ts
│   │     └── register.pipe.ts
│   │
│   │
│   ├── utilities
│   │   ├── email
│   │   │     ├── emailVerification.ts => `for send email message`
│   │   │     └── emailMessagesDesign.ts => `for email messages design ( HTML & CSS )`
│   │   ├── common.ts => `for common variables`
│   │   └── get-id-from-token.ts => `to get id from token`
│   │
│   │
│   └── main.ts => `to run the server`
└──
``` -->

## DataBase ERD

<p align="center">
   <img src="https://user-images.githubusercontent.com/93389016/197892917-d9c0067e-5adf-4078-b2c1-6e16f6c79a0e.jpg" alt="Build Status">
</p>

### After completing the registration as a new user, you must go to your email to confirm the email through the code sent to you

   <img src="https://user-images.githubusercontent.com/93389016/192886872-2c8e9c28-f0a0-4fca-ac30-77f469bb119a.png" alt="Build Status">
   <img src="https://user-images.githubusercontent.com/93389016/192886906-3bc7efe9-c79e-4379-b502-5c6ad117592c.png" alt="Build Status">
</p>

<hr>

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

<hr>

Here are the [Command](https://github.com/MohamedAlabasy/Nest.JS-Articles-System-MongoDB/blob/main/command.txt) that were used in the project, You will find it in the project file.
