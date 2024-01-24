const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}





export { asyncHandler ,asyncdatabase};


// Higher order functions are the functions that accept the another funciton in their peramettiers and run that funciton like map,forEach,filter these are the example of the higher order functions 

//  for example 
//  const function = ()=>{}  if it accept an other function in their parameter 
//   const function  = (fn)=>{()=>{fn()}} so this is higher order function

/*
const asyncHandler = (fn)=> async (req,res,next)=>{
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message:err.message
        })
    }
}
*/
