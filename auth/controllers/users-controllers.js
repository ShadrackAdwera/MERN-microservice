const currentUser = {
    name: 'Deez Nuts',
    email: 'deeznuts@mail.com'
}

const getCurrentUser = (req,res,next) => {
    res.status(200).json({users: currentUser})
}

exports.getCurrentUser = getCurrentUser;