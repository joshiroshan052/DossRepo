const router = require('express').Router();
const licenseController = require('../controllers/licenseController');
const {authGuard,authGuardAdmin} = require('../middleware/authGuard');


router.post('/create_license',authGuard,licenseController.createLicense)

router.get('/get_license/:id',licenseController.getAllLicense)

router.post('/getSingle_license/:id',licenseController.getSingleLicense)

router.put("/update_license/:id",authGuardAdmin,licenseController.updateLicense)

router.delete("/delete_license/:id",licenseController.deleteLicense)
    
router.get("/getAllLicenses",licenseController.getAllLicenses)

router.put('/updateStatus/:id', licenseController.updateLicenseStatus)



module.exports = router;