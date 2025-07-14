const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth'); 

router.post('/add', authenticateToken, cartController.addToCart);
router.put('/item/:itemId', authenticateToken, cartController.updateCartItem);
router.get('/', authenticateToken, cartController.getCart);
router.delete('/item/:itemId', authenticateToken, cartController.removeCartItem);



module.exports = router;
