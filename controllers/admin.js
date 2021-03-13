const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit; // like url ......?edit=true  it will return "true"
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  req.user.getProducts({where:{id:productId}})
    .then((product) => {
      res.render("admin/edit-product", {
        product: product[0],
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const data = req.body;
  const title = data.title.trim();
  const imageUrl = data.imageUrl;
  const description = data.description.trim();
  const price = data.price;

  productId = req.body.productId.trim();
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId.trim();
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = async (req, res, next) => {
  req.user.getProducts()
    .then((product) => {
      res.render("admin/products", {
        prods: product,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
