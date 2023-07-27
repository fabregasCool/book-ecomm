import { createError } from '../error.js';
import Category from '../models/Category.js';

//Recupérer tous les categorys
export const getCategorys = async (req, res, next) => {
  try {
    // const categorys = await Category.find().sort('-updatedAt');
    const categorys = await Category.find();
    // res.status(200).json(categorys.splice(0, 2));Si on veut récuperer uniquement les 2 premiers
    res.status(200).json(categorys);
  } catch (err) {
    next(createError(400, 'Aucune category Trouvée '));
  }
};

//Recupérer un category
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    next(createError(400, 'Aucune category Trouvée '));
    // res.status(501).json(err);
  }
};

//Modifier un category
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: req.body,
      },
      { new: true } //Permet d'afficher les nouvelles valeurs
    );
    res.status(200).json(updateCategory.id + 'Modification réussie');
  } catch (err) {
    return next(createError(400, 'Alert!!! Cette catégorie existe déja '));
    // res.status(501).send(err);
  }
};

//Créer un category
export const createCategory = async (req, res, next) => {
  try {
    const categorys = req.body;
    const category = new Category(categorys);
    await category.save();
    res.status(201).json('Category created');
  } catch (err) {
    console.log(err);
    return next(createError(400, 'Alert!!! Cette catégorie existe déja '));
    // res.status(501).send(err);
  }
};

//Supprimer un category
export const deleteCategory = async (req, res, next) => {
  try {
    const CategoryId = req.params.id;
    await Category.findByIdAndDelete(CategoryId);
    res.status(200).json('Category has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};
