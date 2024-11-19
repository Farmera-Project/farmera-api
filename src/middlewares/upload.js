import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

// Configure Multer to upload to SaveFilesOrg
export const productImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY, // Access token for SaveFilesOrg
        relativePath: '/poultry-feed/*'  // Path to store the images within the service
    }),
    fileFilter: (req, file, cb) => {
        // Ensure that only images are accepted
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for the image size
    }
});

export default productImageUpload;
