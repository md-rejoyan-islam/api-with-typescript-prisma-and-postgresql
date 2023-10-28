"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = require("../middlewares/protect");
const router = (0, express_1.Router)();
// product router
router.get('/products', protect_1.isLoggedIn, (req, res) => { res.send('products'); });
router.get('/products/:id', (req, res) => { });
router.post('/products', (req, res) => { });
router.put('/products/:id', (req, res) => { });
router.delete('/products/:id', (req, res) => { });
// update 
router.get('/update', (req, res) => { });
router.get('/update/:id', (req, res) => { });
router.post('/update', (req, res) => { });
router.put('/update/:id', (req, res) => { });
router.delete('/update/:id', (req, res) => { });
//update point
router.get('/updatepoint', (req, res) => { });
router.get('/updatepoint/:id', (req, res) => { });
router.post('/updatepoint', (req, res) => { });
router.put('/updatepoint/:id', (req, res) => { });
router.delete('/updatepoint/:id', (req, res) => { });
// export 
exports.default = router;
