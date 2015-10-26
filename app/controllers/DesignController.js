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
      title: 'All Designs',
      originUrl: req.originalUrl || '/admin/designs',
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }

  static pinnedPage = async (req, res, next) => {

    let data;

    try {
      data = await DesignManager
      .getAllPinDesign(req.query);
    } catch (e) {
      next(e);
    }

    res.render('designs/index', {
      title: 'Pinned Designs',
      originUrl: req.originalUrl || '/admin/designs',
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }

  static approvedPage = async (req, res, next) => {

    let data;

    try {
      data = await DesignManager
      .getDesignsWithPagination(req.query, {status: 'approved'});
    } catch (e) {
      next(e);
    }

    res.render('designs/index', {
      title: 'Approved Designs',
      originUrl: req.originalUrl || '/admin/designs',
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }

  static rejectedPage = async (req, res, next) => {

    let data;

    try {
      data = await DesignManager
      .getDesignsWithPagination(req.query, {status: 'rejected'});
    } catch (e) {
      next(e);
    }

    res.render('designs/index', {
      title: 'Rejected Designs',
      originUrl: req.originalUrl || '/admin/designs',
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }

  static pendingPage = async (req, res, next) => {

    let data;

    try {
      data = await DesignManager
      .getDesignsWithPagination(req.query, {status: 'pending'});
    } catch (e) {
      next(e);
    }

    res.render('designs/index', {
      originUrl: req.originalUrl || '/admin/designs',
      title: 'Pending Designs',
      designs: data.data,
      pageCount: data.pageCount,
      itemCount: data.itemCount
    });
  }

  static approve = async (req, res, next) => {
    if (!req.params.id) {
      next(new Error('Error: design id is missing'));
    }

    let id = req.params.id;

    let design = await Designs.findOne({_id: id});

    try {
      await DesignManager.approveDesign(design);
    } catch (e) {
      next(e);
    }

    res.redirect(req.query.originURL || '/admin/designs');
  }

  static reject = async (req, res, next) => {
    if (!req.params.id) {
      next(new Error('Error: design id is missing'));
    }

    let id = req.params.id;

    let design = await Designs.findOne({_id: id});

    try {
      await DesignManager.rejectDesign(design);
    } catch (e) {
      next(e);
    }

    res.redirect(req.query.originURL || '/admin/designs');
  }

  static pin = async (req, res, next) => {
    if (!req.params.id) {
      next(new Error('Error: design id is missing'));
    }

    let id = req.params.id;

    let design = await Designs.findOne({_id: id});

    try {
      await DesignManager.pinDesign(design);
    } catch (e) {
      next(e);
    }

    res.redirect(req.query.originURL || '/admin/designs');
  }

  static unpin = async (req, res, next) => {
    if (!req.params.id) {
      next(new Error('Error: design id is missing'));
    }

    let id = req.params.id;

    let design = await Designs.findOne({_id: id});

    try {
      await DesignManager.unpinDesign(design);
    } catch (e) {
      next(e);
    }

    res.redirect(req.query.originURL || '/admin/designs');
  }
}

export default DesignController;
