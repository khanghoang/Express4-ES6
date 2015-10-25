/* @flow */
class DesignManager {
  static getAllApprovedDesigns : Promise = (params: Object, query: Object) => {
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
}

export default DesignManager;

