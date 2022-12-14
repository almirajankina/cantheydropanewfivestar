const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const userModel = require("./model/user.model");
const blogModel = require("./model/blog.model");
const adminModel = require("./model/admin.model");

router.post("/home", async (req, res) => {
  try {
    const userFound = await userModel.findOne({ userName: req.body.user });
    if (userFound) {
      const Pass = await bcrypt.compare(req.body.password, userFound.password);
      if (Pass) {
        req.session.user = req.body.user;
        res.redirect("home");
      } else res.redirect("/Invalid");
    } else res.redirect("/Invalid");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/home", async (req, res) => {
  try {
    if (req.session.user) {
      const blogs = await blogModel.find({});
      const len = blogs.length;
      res.status(200).render("home", {
        user: req.session.user,
        blogs: blogs,
        len: len,
      });
    } else res.status(401).render("unauthorized");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.status(200).redirect("/");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/register/:err?", (req, res) => {
  try {
    res.render("register", { duplicateError: req.params.err });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    let Pass = await bcrypt.hash(req.body.password, 12);
    await userModel.insertMany([
      {
        userName: req.body.user,
        name: req.body.name,
        password: Pass,
        email: req.body.email,
      },
    ]);
    return res.status(200).send({ result: "redirect", url: "/" });
  } catch (err) {
    console.log(err.message);
    return res.status(200).send({
      result: "redirect",
      url: "/route/register/User already exists!",
    });
  }
});

router.post("/adminPanel", async (req, res) => {
  try {
    let adminFound = await adminModel.findOne({
      admin: req.body.admin,
      password: req.body.password,
    });
    if (adminFound) {
      req.session.admin = req.body.admin;
      res.redirect("/route/adminPanel");
    } else {
      res.redirect("/admin/Invalid");
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/adminPanel", async (req, res) => {
  try {
    if (req.session.admin) {
      let users = await userModel.find();
      let blogs = await blogModel.find();
      blogNo = blogs.length;
      len = users.length;
      res.render("adminPanel", {
        admin: req.body.admin,
        users: users,
        len: len,
        blogNo: blogNo,
      });
    } else res.render("adminUnauthorized");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/search", async (req, res) => {
  try {
    if (req.session.admin) {
      let value = new RegExp(req.query.search, "i");
      let result = await userModel.find({
        $or: [{ name: value }, { userName: value }, { email: value }],
      });

      let blogs = await blogModel.find();
      len = result.length;
      blogNo = blogs.length;
      res.render("adminPanel", {
        admin: req.body.admin,
        users: result,
        len: len,
        blogNo: blogNo,
      });
    } else {
      res.render("adminUnauthorized");
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/addUser/:err?", (req, res) => {
  try {
    if (req.session.admin) {
      res.render("addUser", { duplicateError: req.params.err });
    } else res.render("adminUnauthorized");
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/addUser", async (req, res) => {
  try {
    if (req.session.admin) {
      await userModel.insertMany([
        {
          userName: req.body.user,
          name: req.body.name,
          password: Pass,
          email: req.body.email,
        },
      ]);
      return res
        .status(200)
        .send({ result: "redirect", url: "/route/adminPanel" });
    } else res.status(401).render("adminUnauthorized");
  } catch (err) {
    console.log(err.message);
    return res.status(200).send({
      result: "redirect",
      url: "/route/addUser/User already exists",
    });
  }
});

router.get("/modify/:id", async (req, res) => {
  try {
    if (req.session.admin) {
      let user = await userModel.find({ _id: req.params.id });
      res.render("updateUser", { user: user });
    } else res.render("adminUnauthorized");
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/modify", async (req, res) => {
  try {
    if (req.session.admin) {
      await userModel.updateOne(
        { _id: req.body._id },
        {
          userName: req.body.user,
          name: req.body.name,
          email: req.body.email,
        }
      );
      return res
        .status(200)
        .send({ result: "redirect", url: "/route/adminPanel" });
    } else res.render("adminUnauthorized");
  } catch (err) {
    console.log(err.message);
  }
});

router.delete("/modify", async (req, res) => {
  try {
    await userModel.deleteOne({ _id: req.body.userId });
    return res
      .status(200)
      .send({ result: "redirect", url: "/route/adminPanel" });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
