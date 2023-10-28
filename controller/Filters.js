const Filter = require("../model/Filters");

exports.fetchFilters = async (req, res) => {
  // Fetch all filters
  const allFilters = await Filter.find();
  // let totalFilters = Filter.find({})
  try {
    // const totalDocs = await totalQueryProducts.count().exec();
    // res.seFiltert('X-Total-Count', totalDocs)

    res.status(200).json(allFilters);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.addFilters = async (req, res) => {
  const newFilter = new Filter(req.body);
  try {
    const doc = await newFilter.save();
    res.status(200).json(doc);
  } catch (error) {
    res.status(401).json(error);
  }

};
