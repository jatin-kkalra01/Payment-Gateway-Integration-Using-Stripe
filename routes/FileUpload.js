const express = require('express');
const router = express.Router();

const {localFileUpload, imageUpload, videoUpload, imageSizeReducer} = require('../controllers/fileUpload');

//api routes
router.post('/localFileUpload', localFileUpload);
router.post('/imageFileUpload', imageUpload);
router.post('/videoFileUpload', videoUpload);
router.post('/imageSizeReducer', imageSizeReducer);

module.exports = router;