import DesignController from '../controllers/DesignController';
import RouterMixin from './_decorators/routerHelper';

const Router = Object.assign({}, RouterMixin, {
  prefix: '/admin/designs',

  _router: function() {
    return {
      '': {
        get: {
          handler: DesignController.index,
          role: 'admin'
        }
      },
      '/approvedList': {
        get: {
          handler: DesignController.approvedPage
        }
      },
      '/pinnedList': {
        get: {
          handler: DesignController.pinnedPage
        }
      },
      '/rejectedList': {
        get: {
          handler: DesignController.rejectedPage
        }
      },
      '/pendingList': {
        get: {
          handler: DesignController.pendingPage
        }
      },
      '/approve/:id': {
        get: {
          handler: DesignController.approve
        }
      },
      '/reject/:id': {
        get: {
          handler: DesignController.reject
        }
      },
      '/pin/:id': {
        get: {
          handler: DesignController.pin
        }
      },
      '/unpin/:id': {
        get: {
          handler: DesignController.unpin
        }
      },
    }
  }
});

export default Router;
