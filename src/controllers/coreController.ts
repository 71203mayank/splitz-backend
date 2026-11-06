import {asyncHandler} from "../utils/asyncHandler";

class CoreController {
    healthCheck = asyncHandler( async (req, res) => {
        res.status(200).json({
            success: true,
            message: "Server is running"
        })
    })
}

export default new CoreController();