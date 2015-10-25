import DesignManager from '../managers/DesignManager';

class DesignController {
  static index = async (req, res, next) => {

    let data;

    try {
      data = await DesignManager.getDesignsWithPagination(req.query, {});
    } catch (e) {
      next(e);
    }

    res.render('designs/index', {
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }
}

export default DesignController;
