import cloudinary from '../config/cloudinary.js'
import User from '../models/User.js'

export const updateProfile = async (req, res) => {

  try {
    const {image, ...otherData} = req.body

    let updatedData = otherData

    if(image) {
      if(image.startsWith("data:image")){
        try {
          const uploadedResponse = await cloudinary.uploader.upload(image) 
          updatedData.image = uploadedResponse.secure_url;
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: 'Image upload failed'
            })

          }
        }
    }  
  
    const updateUser = await User.findByIdAndUpdate(req.user._id, updateData, {new: true})

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