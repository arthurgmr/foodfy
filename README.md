<h1 align="center">
    <img alt="Chef" src="./public/assets/chef.png" width="150px" />
</h1>

<h1 align="center">Foodfy</h1>

<p align="center">
  <a href="LICENSE" >
<img alt="License" src="https://img.shields.io/badge/license-MIT-%23F8952D">
  </a>
</p>

<h3 align="center">  
  <a href="#-about-the-project">About the project</a> |
  <a href="#-technology">Technology</a> | 
  <a href="#-features">Features</a> | 
  <a href="#-run-the-project">Run the project</a> | 
  <a href="#-license">License</a> 
</h3>

---

## 🗒 About the project <a name="-about-the-project" style="text-decoration:none"></a>

The Foodfy project was developed in parallel with [Rocketseat's](https://rocketseat.com.br/) Bootcamp and had as final challenge the delivery. The website was developed with a full JavaScript stack and has several administrative features, such as: user control, Chef registration, recipe registration, among others.

---

## 👨🏻‍💻 Technology <a name="-technology" style="text-decoration:none"></a>

- **[NodeJS](https://nodejs.org/en/)**
- **[Express](https://expressjs.com/)**
- **[Express Session](https://github.com/expressjs/session)**
- **[Method Override](https://github.com/expressjs/method-override)**
- **[Multer](https://github.com/expressjs/multer)**
- **[PG](https://github.com/brianc/node-postgres/tree/master/packages/pg)**
- **[Connect PG Simple](https://www.npmjs.com/package/connect-pg-simple)**
- **[Bcrypt](https://github.com/dcodeIO/bcrypt.js)**
- **[Nodemailer](https://nodemailer.com/about/)**
- **[Nunjucks](https://github.com/mozilla/nunjucks)**
- **[Faker](https://github.com/Marak/Faker.js#readme)**

---

## :pushpin: Features <a name="-features" style="text-decoration:none"></a>

- **Session Controller (login e logout)**
- **User Registration**
- **User Edition**
- **User Deletion**
- **Password Recovery**
- **Chef Registration**
- **Chef Edition**
- **Chef Deletion**
- **Recipe Registration**
- **Recipe Edition**
- **Recipe Deletion**
- **Search Recipe and Chef**

---

## :rocket: Run-the-project <a name="-run-the-project" style="text-decoration:none"></a>


#### Clone repository

```bash

# Clone repository
$ git clone https://github.com/arthurgmr/foodfy.git

# Access the project folder through the terminal
$ cd foodfy

# Install the dependencies
$ npm install

```

#### Configuring database

Install [PostgreSQL](https://www.postgresql.org/download/) on your computer.

Then run the [project_foodfy.sql](https://github.com/arthurgmr/foodfy/blob/master/foodfydb.sql) file Querys to create the database, tables and other settings.

#### Populate Database

To populate the database with fakes and automatically generated information, open the terminal in the project directory and execute the command::

```bash

$ node seeds.js

```

#### Configuring Mailtrap

Mailtrap will be responsible for simulating an email box for the functionality of creating a user (the password will be sent by email) and recovering the password.

Enter the [Mailtrap](https://mailtrap.io/) website and register. When you are already registered, access the Inboxes tab, create a new inbox with the name of foodfy, enter the SMTP Settings section and change Integrations to Nodemailer. Now copy the generated code, paste it into the [mailer.js](https://github.com/arthurgmr/foodfy/blob/master/src/lib/mailer.js) file  and make some small changes to make it look like this:

```javascript

const nodemailer = require('nodemailer')

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "49d38eb00b88a1",
      pass: "50ff30cfd900e2"
    }
  });

module.exports = transport

```

It is important that the code filled in the mailer.js file is the one generated in your Mailtrap account, otherwise you will not receive the emails correctly.

Finishing all the steps described above successfully, we can now execute the project.

```bash

# Access the project folder through the terminal
$ cd foodfy

# Run the project
$ npm start

# The server will start at port:3000 - go to http://localhost:3000

```

#### Note

By accessing *localhost: 3000* you will be in the public section of foodfy. To access the administrative sector, enter *localhost: 3000/admin*. The default system administrator has the email *admin@foodfy.com* and password *admin*. The other users that are automatically generated have random emails and password *123*.

It may be that when you delete one of the records automatically generated with the seeds, the reference image of all the others will be lost. If this occurs, create another image with the name *placeholder.png* in the *public/images* folder.

---

## :closed_book: License <a name="-license" style="text-decoration:none"></a>


Released in 2021. This project is under the [MIT license](https://github.com/arthurgmr/foodfy/blob/master/LICENSE).

Made with love by Arthur Machado | [Get in touch](https://www.linkedin.com/in/arthurgmachado/) :wave:
