# NodeJs Todo app

This is a very simple todo App running on a NodeJs server. The local 
development database is sqlite. The production version is running with
a MySql database, but you can switch to any database that 
[sequelize js](http://docs.sequelizejs.com/en/latest/) supports. 

Each user has it's own set of todo's. JWT is being used to protect
private routes in express.

**Real time web analytics dashboard and web sockets**

There is also a real- time analytics dashboard available. It shows
real-time web analytics data. It is a simple demonstration for what is
possible with websockets and the [sockets.io library](http://socket.io/)

Try it out! Go with different users to the index page while watching
the dashboard.

The endpoint to reach the dashboard is : /dashboard

## Overview of technologies used

### Back end

* NodeJs
* Express
* Passport & JWT for security
* Sequelize js

### Front end

* Angular Js
* satellizer

### Build tools and transpilers

* gulp
* LESS

Communication backend - frontend: REST

### For Real time analytics

 * socket.io

## Requirements

For local development make sure you have NodeJs installed.

## Setup

Run **npm install** to install the node dependencies. After that you
can run **npm start** to start the server.
