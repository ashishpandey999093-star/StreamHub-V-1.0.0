import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asynchandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const channelId = userId;


    const [
        videoStats,
        subscriberStats,
        likeStats
    ] = await Promise.all([
        Video.aggregate([
            {
                $match: {
                    owner: channelId
                }
            },
            {
                $group: {
                    _id: null,
                    totalVideos: {
                        $sum: 1
                    },
                    totalViews: {
                        $sum: "$views"
                    }
                }
            }
        ]),

        Subscription.aggregate([
            {
                $match: {
                    channel: channelId
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscribers: {
                        $sum: 1
                    }
                }
            }
        ]),
        Video.aggregate([
            {
                $match: {
                    owner: channelId
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: {
                            $size: "$likes"
                        }
                    }
                }
            }
        ])
    ])

    const response = {
        videoStats: videoStats[0] ?? {
            totalVideos: 0,
            totalViews: 0
        },
        subscriberStats: subscriberStats[0] ?? {
            totalSubscribers: 0
        },
        likeStats: likeStats[0] ?? {
            totalLikes: 0
        }
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const channelId = new mongoose.Types.ObjectId(userId);


    const aggregate = Video.aggregate([
        {
            $match: {
                owner: channelId,
                isPublished: true
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }

        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: 1
            }
        }
    ])

    const options = {
        page: Math.max(Number(page), 1),
        limit: Math.min(Math.max(Number(limit), 1), 50)
    };

    const videos = await Video.aggregatePaginate(
        aggregate,
        options
    )
    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Videos fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}