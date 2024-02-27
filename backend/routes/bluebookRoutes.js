const router = require('express').Router();
const bluebookController = require('../controllers/bluebookController');
const { authGuardAdmin, authGuard } = require('../middleware/authGuard');

// Create a new bluebook entry
router.post('/create_bluebook',authGuard, bluebookController.createBluebook);

// Get a single bluebook entry by ID
router.get('/get_bluebook/:id', bluebookController.getSingleBluebook);

// Get all bluebook entries by user ID
router.get('/getAll/:id', bluebookController.getAllBluebook);

// Update a bluebook entry by ID
router.put("/update_bluebook/:id", bluebookController.updateBluebook);

// Delete a bluebook entry by ID
router.delete("/delete_bluebook/:id", bluebookController.deleteBluebook);

router.get('/getAllBluebook', bluebookController.getAllBluebooks);

router.put('/updateStatus/:id', bluebookController.updateBluebookStatus);





module.exports = router;
