/* @flow */
class DesignManager {

  static approveDesign : number|Error =
    async (design: Designs) => {
      return await DesignManager._changeDesignStatus('approved', design);
    }

  static rejectDesign : number|Error =
    async (design: Designs) => {
      return await DesignManager._changeDesignStatus('rejected', design);
    }

  static _changeDesignStatus : number|Error =
    async (status: string, design: Designs) => {
      design.status = status;
      let err = design.validateSync();
      if (err) {
        return err;
      }

      return await design.save();
    }

  static getDesignsWithPagination : Promise =
    (params: Object, query: Object) => {
      return new Promise(function(resolve, reject) {
        Designs.paginate(
          query,
          {
            page: params.page || 0,
            limit: params.limit || 50
          },
          function(err, designs, pageCount, itemCount) {
            if (err) {
              return reject(err);
            }

            return resolve({
              data: designs,
              pageCount: pageCount,
              itemCount: itemCount
            });
          });
      });
    };

  static getAllApprovedDesigns : Promise = (params: Object, query: Object) => {
    return DesignManager.getDesignsWithPagination(params, query);
  };
}

export default DesignManager;

