const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("./shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = async (req, res, next) => {
  Product.findAll()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = async (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      res.render("./shop/cart", {
        pageTitle: "Cart",
        prods: products,
        path: "/cart",
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // const products = await Product.fetchAll();
  // const cart = await Cart.getProducts(products);
  // console.log(cart);
  // const productsWithQty = cart.cartProducts;
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId.trim();
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(async (products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        newQuantity = product["cart-item"].qty;
        newQuantity++;
      }
      const product_1 = await Product.findByPk(productId);
      return fetchCart.addProduct(product_1, { through: { qty: newQuantity } });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => {
      console.log(err);
    });
  //res.redirect("/cart");
};

exports.postRemoveProduct = async (req, res, next) => {
  const productId = req.body.productId.trim();
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(async (products) => {
      let product = products[0];
      product = products[0];
      let newQuantity = product["cart-item"].qty;
      const product_1 = await Product.findByPk(productId);
      if (newQuantity === 1)
        return fetchCart.removeProduct(product_1);
      else {
        newQuantity--;
        return fetchCart.addProduct(product_1, {
          through: { qty: newQuantity },
        });
      }
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders=>{
    return orders[0].getProducts();
  })
  .then(products=>{
    //console.log(products[0].orderItem);
    res.render("shop/orders", {
      prods: products,
      path: "/orders",
      pageTitle: "Your Orders",
    });
  })
  .catch(err=>{
    console.log(err);
  })
  
};

exports.postCreateOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = { qty: product["cart-item"].qty };
            return product;
          })
        );
      });
    })
    .then(() => {
      res.redirect("/orders");
    })
    .then(()=>{
      fetchCart.setProducts(null);
    })
    .catch(err=>{
      console.log(err);
    })
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
