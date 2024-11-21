import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

// Configure Multer to upload to SaveFilesOrg
export const productImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/farmera/products/*'
    }),
    preservePath: true
});

export const userImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/farmera/users/*'
    }),
    preservePath: true
});