// routes/configHistory.routes.js
const express = require('express');
const router = express.Router();
const configHistoryController = require('../controllers/configHistory.controller.js');

// Lấy tất cả cấu hình
router.get('/', configHistoryController.getAllConfigs);

// Lấy tất cả cấu hình và nhóm theo uploadedBy
router.get('/grouped-by-uploadedBy', configHistoryController.getConfigsGroupedByUploadedBy);

// Xóa cấu hình theo ID
router.delete('/:id', configHistoryController.deleteConfigById);

// Cập nhật cấu hình theo ID
router.put('/:id', configHistoryController.updateConfigById);

module.exports = router;
