import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser  = asyncHandler( async function (req, res) {
    const {username, email, password, fullName} = req.body

    if (
        [username, email, password, fullName].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists!")
    }

    const avatarLocalFilePath = res.files?.avatar[0]?.path;
    const coverImageLocalFilePath = res.files?.coverImage[0]?.path;

    if (!avatarLocalFilePath) {throw new ApiError(400, "Avatar File is required")} 

    const avatar =  await uploadOnCloudinary(avatarLocalFilePath)
    const coverImage =  await uploadOnCloudinary(coverImageLocalFilePath)

    if (!avatar) {throw new ApiError(400, "Avatar File is required")}

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        fullName
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {throw new ApiError(500, "Something went wrong while registering new user")};

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully")
    )

})

export { registerUser }