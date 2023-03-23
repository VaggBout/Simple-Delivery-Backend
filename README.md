# Online Delivery - Backend

A simple back-end of an online delivery application based on Express and Mongodb.

# Features

Public API:

-   Get live stores
-   Get store's menu
-   Create a new order

Backoffice API:

-   User management(Register/Login) through JWT
-   Create new store
-   Create menu categories & products
-   Publish store

Backoffice Pages:

-   Login
-   View orders

# Deployment

## a. Run on Host

### Clone project

```bash
git clone https://github.com/VaggBout/Simple-Delivery-Backend.git
```

### Database setup

Before proceeding you will need an accessible running instance of MongoDB with a user who has access to it.  
If you don't have one you can deploy using [Docker](https://docs.docker.com/engine/install/) and the existing `docker-compose.yml` in the project. From the root folder of the project run:

```bash
docker-compose -f docker/docker-compose.yml up -d mongo
```

This will deploy a MongoDB container with an empty database `delivery`, and a user `user` with password `password`.

### Install dependencies

In order to run the project you will need `NodeJs` and `NPM` installed. It is suggested to use NodeJs 16.x or any newer LTS version. For installation instructions check [here](https://nodejs.org/en)

After having NodeJs and NPM installed you should install all the necessary dependencies. From the root folder run:

```bash
npm install
```

### Create configuration file

In the root folder of the project exists a file `example.env`. While in the root folder run

```bash
cp example.env .env
```

After that, using your favorite text editor, fill the missing properties with the appropriate values. The following values assume you have deployed a database using `docker` (previous step).

```
NODE_ENV=production

# Application port
PORT=3000

TOKEN_SECRET=secret
DATABASE_URL=mongodb://user:password@localhost:27017/delivery

# API key for https://api.apilayer.com/fixer
FIXER_API_KEY=<api-key>
```

### Run application

In order to start the application run the following:

```bash
npm run build
npm run start
```

The aforementioned scripts will compile the application and bootstrap the server.  
After the server starts you can access it at http://localhost:3000/.

# Usage

## Postman

In order to use the exposed APIs it is recommended you download [Postman](https://www.postman.com/downloads/).

In the root folder of the project exists a Postman collection's file `simple-delivery-backend.postman_collection.json`. After opening Postman in your desktop you can import this file by pressing `Import` in the top-left corner. This will create a new Collection `simple-delivery-backend` which contains two folders:

-   API: Contains the public API meant to be consumed from the guest users
-   Backoffice: Contains the private API meant to be consumed from the merchants

## Get started

In this section we will describe the process to create a new store and making it available to users and allow them to place new orders. Keep in mind these steps require a running instance of the server.

## Backoffice API

### Register

The first thing you want to do is to register a new user to the system. Open `Backoffice->Register` request in Postman, fill the body of the request with user information and send the request. Example:

`POST <base-url>/backoffice/api/register`

```json
{
    "name": "Test Name",
    "email": "test@email.com",
    "address": "Aigaleo, Athens",
    "password": "abc123!"
}
```

### Login

After registering a user in the system you should log-in to acquire a security token. Open `Backoffice->Login` request in Postman, fill the body with the proper data and send the request. The response will contain a cookie `token` which is the access token you can use to interact with the system. Postman automatically includes the cookie to your requests. Example:

`POST <base-url>/backoffice/api/login`

```json
{
    "email": "test@email.com",
    "password": "abc123!"
}
```

### Create a new store entry

The next thing you want to do is to create a new store entry. Open `Backoffice->Create store` request in Postman, fill the body with the proper data and send the request. The response will contain the store ID. You should save it somewhere since we will use it later on. Example:

`POST <base-url>/backoffice/api/stores`

```json
{
    "name": "My store!"
}
```

### Create a new category

The next thing you must do is to create your menu for your new store! Open `Backoffice->Create category` request, fill the body with the proper data and send the request. Keep in mind the `store` property inside the body refers to the store-id we created on the previous step. Furthermore you must include at least 2 products inside the request. Before proceeding to the next step make sure you have created at least 3 categories! Example:

`POST <base-url>/backoffice/api/categories`

```json
{
    "name": "My category",
    "store": "<store-id>",
    "products": [
        {
            "name": "Product 1",
            "description": "Product description",
            "price": 1.0
        },
        {
            "name": "Product 2",
            "description": "Product description",
            "price": 5.5
        },
        {
            "name": "Product 3",
            "description": "Product description",
            "price": 7.8
        }
    ]
}
```

### Publish your store!

After creating your menu the final thing you must do is to publish your store and make it available! Keep in mind before publishing your store you must complete all the previous steps!

Open `Backoffice->Publish store` request, add the store-id to the URL parameter and send the request. Example:

`PATCH <base-url>/backoffice/api/stores/:storeId/publish`

If you receive a response status 200 then your store is live!

## Public API

Now that we have a live store we can start placing some orders! The following is a walkthrough to the public API. The public API is available at the `API` folder.

### Retrieve live stores

Open `API->Get live stores` and press send. The response will contain a list of all the live stores from which you can order from. Example:

`GET <base-url>/api/stores`

Response:

```json
[
    {
        "_id": "641717cf3733346d4cd554e0",
        "name": "My store",
        "status": "LIVE",
        "owner": "6416424bd26e23c4da8798fc",
        "__v": 0
    }
]
```

### Retrieve store's menu

After you choose from which store you want to order open `API->Get menu` and add the `_id` of the store you wish to get the menu for to the `storeId` path parameter. You can also define a `currency` query parameter if you want to view the menu to another currency. Keep in mind the default prices are in `EUR`. In order to request the menu to another currency you must provide a valid currency code in the `currency` query parameter. Example:

`GET <base-url>/api/stores/:storeId/menu?currency=USD`

Response:

```json
[
    {
        "_id": "641c9e564096e4e22c51100d",
        "name": "My category",
        "products": [
            {
                "name": "Product 1",
                "description": "Product description",
                "price": "1.09",
                "_id": "641c9e564096e4e22c51100e"
            },
            {
                "name": "Product 2",
                "description": "Product description",
                "price": "5.98",
                "_id": "641c9e564096e4e22c51100f"
            },
            {
                "name": "Product 3",
                "description": "Product description",
                "price": "8.48",
                "_id": "641c9e564096e4e22c511010"
            }
        ]
    },
    {
        "_id": "641c9e584096e4e22c511015",
        "name": "My category1",
        "products": [
            {
                "name": "Product 1",
                "description": "Product description",
                "price": "1.09",
                "_id": "641c9e584096e4e22c511016"
            },
            {
                "name": "Product 2",
                "description": "Product description",
                "price": "5.98",
                "_id": "641c9e584096e4e22c511017"
            },
            {
                "name": "Product 3",
                "description": "Product description",
                "price": "8.48",
                "_id": "641c9e584096e4e22c511018"
            }
        ]
    },
    {
        "_id": "641c9e5d4096e4e22c51101d",
        "name": "My category2",
        "products": [
            {
                "name": "Product 1",
                "description": "Product description",
                "price": "1.09",
                "_id": "641c9e5d4096e4e22c51101e"
            },
            {
                "name": "Product 2",
                "description": "Product description",
                "price": "5.98",
                "_id": "641c9e5d4096e4e22c51101f"
            },
            {
                "name": "Product 3",
                "description": "Product description",
                "price": "8.48",
                "_id": "641c9e5d4096e4e22c511020"
            }
        ]
    }
]
```

### Create new order

Finally after viewing the menu we place a new order! Open `API->Create new order` and add the `_id` of the store you wish to order from. After that Fill the body with the appropriate values. The `products.*._id` refers to the `_id` property of the product you want, from the `Get menu` response, and not to the category. Example:

`POST <base-url>/api/stores/:storeId/orders`

Body:

```json
{
    "user": {
        "name": "User Name",
        "email": "test@email.com",
        "address": "Aigaleo, Attiki"
    },
    "products": [
        {
            "_id": "<product-id>",
            "quantity": 3
        },
        {
            "_id": "<product-id>",
            "quantity": 1
        },
        {
            "_id": "<product-id>",
            "quantity": 5
        }
    ]
}
```

If the order is properly created the response will contain the order id.

## View incoming orders

After following the previous steps you can open the internal dashboard to view incoming orders. From your browser open `<base-url>/backoffice/login` and login with the credentials you created earlier. After a successful login you will be redirected to `<base-url>/backoffice/stores/:id/orders` where you can view your orders. If you place a new order, through Postman, after a few seconds you should automatically view the new order, without refreshing the page.
