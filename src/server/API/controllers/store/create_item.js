import keystone from 'keystone';

const StoreItem = keystone.list('StoreItem');
/* eslint no-param-reassign: 0 */  // --> OFF
const createItem = (params, cb) => {
  const name = params.name;
  const category = params.category;
  const price = parseInt(params.price, 10);
  const currency = params.currency;
  const paymentOptions = params.paymentOptions;
  const certificate = params.certificate === 'true';
  const itemDescription = params.itemDescription;
  const productVideo = params.productVideo;
  const publisher = params.userId;

  if (!(name && category && price && currency && paymentOptions && itemDescription)) {
    return cb({ status: 400, message: 'Missing required parameters', success: false });
  }

  StoreItem.model.create(
    {
      name,
      category,
      price,
      currency,
      paymentOptions,
      certificate,
      itemDescription,
      productVideo,
      publisher,
    },
    (err, item) => {
      if (err) {
        return cb({ status: 500, message: 'Internal server error', success: false });
      }

      if (productVideo) {
        item._.productVideo.uploadFile(productVideo, true, (error, file) => {
          if (error) {
            return console.error(error);
          }
          item.productVideo = file;
          item.save();
        });
      }

      return cb(null, { data: item, status: 201, success: true });
    },
  );
};

export default createItem;

