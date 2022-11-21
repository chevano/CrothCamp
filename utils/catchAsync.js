// Passes the error to the Error Handler
module.exports = func => {
    return ( req, res, next ) => {
        func( req, res, next ).catch( next );
    }
} 