import { createError } from '../error.js';
import Author from '../models/Author.js';

//Recupérer tous les taille(author)s
export const getAuthors = async (req, res, next) => {
  try {
    // const authors = await Author.find().sort('-updatedAt');
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    next(createError(400, 'Aucune taille(author) Trouvée '));
  }
};

//Recupérer un taille(author)
export const getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (err) {
    next(createError(400, 'Aucune taille(author) Trouvée '));
    // res.status(501).json(err);
  }
};

//Modifier un author
export const updateAuthor = async (req, res, next) => {
  try {
    const authorId = req.params.id;
    const updateAuthor = await Author.findByIdAndUpdate(
      authorId,
      {
        $set: req.body,
      },
      { new: true } //Permet d'afficher les nouvelles valeurs
    );
    res.status(200).json(updateAuthor.id + 'Modification réussie');
  } catch (err) {
    return next(createError(400, 'Alert!!! Cette taille(author) existe déja '));
    // res.status(501).send(err);
  }
};

//Créer un author
export const createAuthor = async (req, res, next) => {
  try {
    const authors = req.body;
    const author = new Author(authors);
    await author.save();
    res.status(201).json('Author created');
  } catch (err) {
    console.log(err);
    return next(createError(400, 'Alert!!! Cette taille(author) existe déja '));
    // res.status(501).send(err);
  }
};

//Supprimer un taille(author)
export const deleteAuthor = async (req, res, next) => {
  try {
    const AuthorId = req.params.id;
    await Author.findByIdAndDelete(AuthorId);
    res.status(200).json('Author has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};
