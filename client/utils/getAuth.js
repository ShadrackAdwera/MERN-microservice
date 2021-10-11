export const getAuth = (stringifiedAuth) => {
    //pass session.user.email
    return JSON.parse(stringifiedAuth);
}