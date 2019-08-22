const AdminController = () => {
  const getAll = async (req, res) => {
    return res.status(200).json({ message: "" });
  };

  return {
    getAll
  };
};
module.exports = AdminController;
