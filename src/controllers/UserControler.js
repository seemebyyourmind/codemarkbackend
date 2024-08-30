const ProductService = require("../services/ProductService");

const getAllPet = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getAllPet(req.params.page);
    console.log(pets);

    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};
const getPetWithBreed = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getPetWithBreed(req.params.id);
    console.log(pets);

    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getPetWithSpecies = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getPetWithSpecies(req.params.id);
    console.log(pets);

    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getAllPetCare = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getAllPetCare(req.params.page);
    console.log(pets);

    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};
const getPetCareCatalogType = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getPetCareCatalogType(req.params.id);
    console.log(pets);
    // if (!pets) {
    //   return res.status(200).json({ status: "ok" });
    // }
    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getPetCareCatalog = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getPetCareCatalog(req.params.id);
    console.log(pets);
    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};
const getPetCareWithSpecies = async (req, res) => {
  try {
    // check trùng số điện thoại
    const pets = await ProductService.getPetCareWithSpecies(req.params.id);
    console.log(pets);

    //Tạo tài khoản
    return res.status(200).json(pets);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getCatalog = async (req, res) => {
  try {
    const id = req.params.id;
    // check trùng số điện thoại
    const catalog = await ProductService.getCatalog(id);
    //Tạo tài khoản
    return res.status(200).json(catalog);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getBreed = async (req, res) => {
  try {
    // check trùng số điện thoại
    const id = req.params.id;
    const breed = await ProductService.getBreed(id);
    //Tạo tài khoản
    return res.status(200).json(breed);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getPetId = async (req, res) => {
  try {
    // check trùng số điện thoại
    const id = req.params.id;
    const breed = await ProductService.getPetId(id);
    //Tạo tài khoản
    return res.status(200).json(breed);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};

const getPetCareId = async (req, res) => {
  try {
    // check trùng số điện thoại
    const id = req.params.id;
    const breed = await ProductService.getPetCareId(id);
    //Tạo tài khoản
    return res.status(200).json(breed);
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};
module.exports = {
  getAllPet,
  getPetWithSpecies,
  getPetWithBreed,
  getAllPetCare,
  getPetCareCatalogType,
  getPetCareCatalog,
  getPetCareWithSpecies,
  getBreed,
  getCatalog,
  getPetId,
  getPetCareId,
};
