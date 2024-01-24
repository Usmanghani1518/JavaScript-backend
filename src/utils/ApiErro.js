class ApiError extends Error{
  constructor(
    statuscode,
    message="the erro in this file",
    stack="",
    error=[]
  ){
   super(message)
   this.statuscode = statuscode
   this.stack = stack
   this.error = error
   this.data= null
   this.success = false

if (stack) {
    this.stack = stack
}else{
    // this below line is used to capture the screenshot of where the error start for example we have 10 blogs the error start at 3 blog so it give us the idea when we see this where actually the error start    Error.captureStackTrace(this,this.constructor)
    // when you look at the error later, you get a clear picture of where it started from in your code, helping you figure out what went wrong more easily. It's a tool that helps developers understand and debug errors by providing information about the sequence of function calls that led to the error.
    Error.captureStackTrace(this, this.constructor)
}

  }

}


export {ApiError}