const USER = 1;
const ADMIN = 2;

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    if (user) {
      const profile = parseInt(user.profile);
      const originalUrl = req.originalUrl;

      if (originalUrl.indexOf("/users")!== -1 && profile !== ADMIN) {
        return res.render("login", {
          title: "Login",
          message: "Autentique-se para ver esta página!"
        });
      }

      return next();
    }
  }

  // Se não estiver autenticado ou sem user
  return res.render("login", {
    title: "Login",
    message: "Autentique-se para ver esta página!"
  });
};
