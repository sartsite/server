/*import { v2 as cloudinary } from 'cloudinary';*/
import { UploadClient } from '@uploadcare/upload-client'

const client = new UploadClient({ publicKey: 'c3643d2d224fa1ff5150' });

const cldUpload = async imagePath => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {

    /* const result = await cloudinary.uploader.upload(imagePath, options); */
    const result = await client.uploadFile(imagePath);
    /*return result.secure_url;*/
    return result.cdnUrl;
  } catch (error) {
    console.error(error);
  }
};

export const addImage = async (req, res, next) => {
  try {
    const { data, mimetype } = req.files.image;
    /*const base64String = Buffer.from(data).toString('base64');
    const withPrefix = `data:${mimetype};base64,${base64String}`;
    */
    const withPrefix = data;
    const imageUrl = await cldUpload(withPrefix);
    return res.status(200).json({ status: 'ok', imageUrl });
  } catch (error) {
    next({ status: 500, error });
  }
}; 
