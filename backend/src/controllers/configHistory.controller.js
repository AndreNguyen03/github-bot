// controllers/configHistory.controller.js
const { default: mongoose } = require('mongoose');
const ConfigHistory = require('../models/configHistory.model.js');

// Hàm lấy tất cả cấu hình và nhóm theo uploadedBy
const getConfigsGroupedByUploadedBy = async (req, res) => {
  console.log("Received request to get configs grouped by uploadedBy");

  try {
    const data = await ConfigHistory.aggregate([
      {
        $group: {
          _id: "$uploadedBy",  // Nhóm theo trường uploadedBy
          configs: { $push: "$$ROOT" }  // Đưa tất cả các cấu hình vào mảng 'configs'
        }
      },
      { $sort: { "_id": 1 } } // Sắp xếp theo uploadedBy (nếu cần)
    ]);

    console.log("Successfully retrieved configs grouped by uploadedBy");

    // Trả về kết quả
    res.json(data);
  } catch (err) {
    console.error("Error retrieving configs grouped by uploadedBy:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Hàm lấy tất cả cấu hình
const getAllConfigs = async (req, res) => {
  console.log("Received request to get all configs");

  try {
    const data = await ConfigHistory.find({});
    console.log(`Successfully retrieved ${data.length} configs`);

    res.json(data);
  } catch (err) {
    console.error("Error retrieving all configs:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Hàm xóa cấu hình theo ID
const deleteConfigById = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete config with ID: ${id}`);

  try {
    await ConfigHistory.findByIdAndDelete(id);
    console.log(`Successfully deleted config with ID: ${id}`);

    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting config with ID: ${id}`, err.message);
    res.status(500).json({ message: err.message });
  }
};

// Hàm cập nhật cấu hình theo ID
const updateConfigById = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to update config with ID: ${req.body._id}`);
  console.log(`Received request to update config with ID: ${id}`);
  console.log(`Collection: ${ConfigHistory.collection.name}`);
  console.log(`Database: ${ConfigHistory.db.name}`);

  // Validate ObjectId
  if (!mongoose.isValidObjectId(id)) {
    console.log(`Invalid ObjectId: ${id}`);
    return res.status(400).json({ message: "Invalid config ID" });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(id);

    // Debug: List all documents in the collection
    const allConfigs = await ConfigHistory.find({id});
    console.log(`All documents in ${ConfigHistory.collection.name}:`);
    console.log(JSON.stringify(allConfigs, null, 2));

    // Convert string ID to ObjectId
    console.log(`Converted to ObjectId: ${objectId}`);

    // Check if document exists
    const existingConfig = await ConfigHistory.findById(objectId);
    if (!existingConfig) {
      console.log(`Config with ID: ${id} not found in collection ${ConfigHistory.collection.name}`);
      return res.status(404).json({ message: "Config not found" });
    }
    console.log(`Found config: ${JSON.stringify(existingConfig, null, 2)}`);

    // Update the document
    const updatedConfig = await ConfigHistory.findByIdAndUpdate(
      objectId,
      req.body,
      { new: true }
    );
    console.log(`Successfully updated config with ID: ${id}`);
    res.json(updatedConfig);
  } catch (err) {
    console.error(`Error updating config with ID: ${id}`, err.message);
    res.status(500).json({ message: err.message });
  }
};

// Export các hàm ở dưới
module.exports = {
  getConfigsGroupedByUploadedBy,
  deleteConfigById,
  updateConfigById,
  getAllConfigs
};
