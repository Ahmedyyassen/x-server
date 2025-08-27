const asyncHandler = (controller) => {
    return async (req, res, next) => {
        await controller(req, res, next).catch((e) => next(e));
    };
};
export default asyncHandler;
