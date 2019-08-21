const AdminController = () => {
    const getAll = async (req, res) => {
        return res.status(200).json({ message: 'this is test' });
    };  
  
    return {
      getAll
    };
};
module.exports.AdminController = AdminController;
