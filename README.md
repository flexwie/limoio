# limo.io [![Build Status](https://travis-ci.org/flexwie/limoio.svg?branch=master)](https://travis-ci.org/flexwie/limoio)
A shopware written in NodeJS using the MEAN stack

### Intention
This project is intended to provide a e-commerce backend for frontend developers. Frontend developement is done using static HTML pages and AngularJS for dynamic content which is fetched over API calls.

### Installation

There is no installation script so far. To use Limo.io on your server simply clone this repository, make sure you have a MongoDB process running on port 27017 and a domain pointing to the used port.

### Features

By now, all there is implemented is a very basic product model, a way to edit and delete products and a media upload.

### Coming Soon & Contributing

Next step is to build a page for single products, outsurce the admin panel different options in partials, extend the product model, add user management and hashed passwords.
If you want to contribute to any of these topics just drop me a message and I will provide you with further information!

### API Reference

`GET /products/`
Returns JSON with all products

`GET /products/:id`
Returns JSON with specific product

`POST /products/`
Create a new product. Requires a valid token.
