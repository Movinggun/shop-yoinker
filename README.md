# ~~Rustler V8~~ Yoink V1
> “The human being is a very poorly designed machine tool. The human being excels in coordination. He excels in relating perception to action. He works best if the entire human being, muscles, senses, and mind, is engaged in the work.” 
― Peter Drucker

### Installation

Yoink V1 requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd shop-yoinker
$ npm install -d
$ node app
```
### Config
```json
{
    "url": "https://undefeated.com/products/nike-x-fear-of-god-nike-air-skylon-ii-white-black-sail?variant=18114204631113",
    "baseurl": "https://undefeated.com/",
    "auth_token_var": "Shopify.ClientAttributesCollection.checkoutToken",
    "username": "",
    "password": "",
    "card":{
        "number": "",
        "name": "",
        "expiry": "",
        "cvv": ""
    }
}
```
