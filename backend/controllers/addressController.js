const { Address } = require('../models');

const createAddress = async (req, res) => {
  try {
    const { street, city, province, country, zip, phone } = req.body;
    if (!street || !city || !province || !country || !zip) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newAddress = await Address.create({
      street,
      city,
      province,
      country,
      zip,
      phone: phone || null, // Phone is optional
      userId: req.user.id,
    });
    return res.status(201).json(newAddress);
  } catch (err) {
    console.error('createAddress error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    return res.status(200).json(addresses);
  } catch (err) {
    console.error('getAllAddresses error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllAddressesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const addresses = await Address.findAll({ where: { userId } });
    if (addresses.length === 0) {
      return res
        .status(404)
        .json({ message: 'No addresses found for this user' });
    }
    return res.status(200).json(addresses);
  } catch (err) {
    console.error('getAllAddressesByUserId error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAddress = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Address ID is required' });
    }
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    await address.update(req.body);
    return res.status(200).json(address);
  } catch (err) {
    console.error('updateAddress error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    await address.destroy();
    return res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('deleteAddress error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAllAddressesByUserId,
  updateAddress,
  deleteAddress,
};
