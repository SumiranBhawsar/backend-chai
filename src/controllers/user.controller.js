import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username and email
    // check for images, check for avatar
    // upload them to cloudinary server, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response

    //get user details from frontend
    const {username, email, password, fullName} = req.body
    console.log("EMAIL: ",email, "FULLNAME: ",fullName);

    // validation
    if(
        [username, email, password, fullName].some(field => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields must be required");
    }

    // check if user already exists
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User already exists");
    }
    
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;  // avatar file local path in personal server uploaded by user from frontend
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // upload them to cloudinary server, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    // create user object - create entry in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )

    if(!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully"),
    )
});

export default registerUser;
 