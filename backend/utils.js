import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    // On voit bien que l'objet user qui est renvoyé est dépourvu du mot de passe( Donc c'est parfait)
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },

    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
      // Ce token expire dans 30 jrs
    }
  );
};

//isAuth (Verifier si l'utilisateur est authentifié (relié à orderRoute))
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); //Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
