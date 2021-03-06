const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

//getProducts
router.post("/cart", shopController.postCart);

router.post("/cart/remove-product", shopController.postRemoveProduct);

router.get("/orders", shopController.getOrders);
router.post("/create-order",shopController.postCreateOrder);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
