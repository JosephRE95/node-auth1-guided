async function protect(req, res ,next) {
    if (req.session.user){
        next()
    } else {
        next({ status: 401, message: 'not allowed in here'})
    }
}

module.exports = {
    protect,
}