import cloudinary from '../config/cloudinary.js'
import User from '../models/User.js'


export const updateProfile = async (req, res) => {

  try {
    const {image, ...otherData} = req.body

    let updatedData = otherData;

    if(image) {
      if(image.startsWith("data:image")){
        try {
          const uploadResponse = await cloudinary.uploader.upload(image) 
          updatedData.image = uploadResponse.secure_url;
          } catch (error) {
            console.log("Error in image upload: ", uploadError);

            return res.status(400).json({
              success: false,
              message: 'Image upload failed'
            })

          }
        }
    }  
  
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })

  }
}