import { log } from "console";
import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

// Configure Multer for file upload
export const productImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/poultry-feed/products/'
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'), false);
        }

        console.log(req.file);
        

    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    preservePath: true
})

export default productImageUpload