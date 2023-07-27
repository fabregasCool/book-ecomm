import { createError } from '../error.js';
import Size from '../models/Size.js';

//Recupérer tous les taille(size)s
export const getSizes = async (req, res, next) => {
  try {
    // const sizes = await Size.find().sort('-updatedAt');
    const sizes = await Size.find();
    res.status(200).json(sizes);
  } catch (err) {
    next(createError(400, 'Aucune taille(size) Trouvée '));
  }
};

//Recupérer un taille(size)
export const getSize = async (req, res, next) => {
  try {
    const size = await Size.findById(req.params.id);
    res.status(200).json(size);
  } catch (err) {
    next(createError(400, 'Aucune taille(size) Trouvée '));
    // res.status(501).json(err);
  }
};

//Modifier un size
export const updateSize = async (req, res, next) => {
  try {
    const sizeId = req.params.id;
    const updateSize = await Size.findByIdAndUpdate(
      sizeId,
      {
        $set: req.body,
      },
      { new: true } //Permet d'afficher les nouvelles valeurs
    );
    res.status(200).json(updateSize.id + 'Modification réussie');
  } catch (err) {
    return next(createError(400, 'Alert!!! Cette taille(size) existe déja '));
    // res.status(501).send(err);
  }
};

//Créer un size
export const createSize = async (req, res, next) => {
  try {
    const sizes = req.body;
    const size = new Size(sizes);
    await size.save();
    res.status(201).json('Size created');
  } catch (err) {
    console.log(err);
    return next(createError(400, 'Alert!!! Cette taille(size) existe déja '));
    // res.status(501).send(err);
  }
};

//Supprimer un taille(size)
export const deleteSize = async (req, res, next) => {
  try {
    const SizeId = req.params.id;
    await Size.findByIdAndDelete(SizeId);
    res.status(200).json('Size has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};
