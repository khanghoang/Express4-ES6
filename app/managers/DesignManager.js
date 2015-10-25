import Promise from 'bluebird';

function getAllApprovedDesigns(req, query) {
  return new Promise(function(resolve, reject) {
    console.log('here');
    debugger;
    Designs.paginate(query,
                     {
                       page: req.query.page,
                       limit: req.query.limit
                     },
                     function(err, designs, pageCount, itemCount) {

                       console.log('there');
    debugger;

                       console.log({
                         data: designs,
                         pageCount: pageCount,
                         itemCount: itemCount
                       });

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

export default getAllApprovedDesigns;
