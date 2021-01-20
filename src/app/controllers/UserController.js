const { post } = require("../../routes/users")

module.exports = {
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    async post(req, res) {
        
    }
}