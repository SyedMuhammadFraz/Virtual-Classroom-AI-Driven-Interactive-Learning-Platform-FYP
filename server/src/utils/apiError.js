class apiError extends Error{

    constructor(
        statusCode,
        message= "Something went wrong",
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
    }
}

export {apiError}