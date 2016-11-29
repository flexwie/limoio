# limo.io [![Build Status](https://travis-ci.org/flexwie/limoio.svg?branch=master)](https://travis-ci.org/flexwie/limoio)
A shopware written in NodeJS using the MEAN stack

### Intention
This project is intended to provide a e-commerce backend for frontend developers. Frontend developement is done using static HTML pages and AngularJS for dynamic content which is fetched over API calls.

### Installation

There is no installation script so far. To use Limo.io on your server simply clone this repository, make sure you have a MongoDB process running on port 27017 and a domain pointing to the used port.

### API Reference

`GET /products/`
Returns JSON with all products

`POST /products/`
Create a new product. Requires a valid token.
