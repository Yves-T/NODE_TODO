# NodeJs Todo API

This is a very simple todo App running on a NodeJs server. The local 
development database is sqlite. The production version is running with
a MySql database, but you can switch to any database that 
[sequelize js](http://docs.sequelizejs.com/en/latest/) supports. 

Each user has it's own set of todo's. JWT is being used to protect
private routes in express.

## Overview of technologies used

### Backend

* NodeJs
* Express
* Passport & JWT for security
* Sequelize js

### Front end

* Angular Js
* satellizer

Communication backend - frontend: REST

## Requirements

For local development make sure you have NodeJs installed.

## Setup

Run **npm install** to install the node dependencies. After that you
can run **npm start** to start the server.
