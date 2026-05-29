db = db.getSiblingDB('ecommerceDB')

db.createCollection('users')
db.createCollection('products')
db.createCollection('carts')
db.createCollection('sessions')