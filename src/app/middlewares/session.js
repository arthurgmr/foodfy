function isLoggedRedirectToUser(req, res, next) {
    if (req.session.userId)
        return res.redirect('/admin/users')
    
    next()
}

module.exports = {
    isLoggedRedirectToUser
}

