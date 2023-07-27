export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

//   Cette fonction va afficher le message spécifique venant du backend correpondant à l'erreur
