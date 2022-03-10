const { Comment } = require('../models');

const commentdata = [
  {
    comment_text: 'Going to visit Florida!.',
    user_id: 2,
    post_id: 1
  },
  {
    comment_text: 'Toys Story 2 is good kids movie',
    user_id: 3,
    post_id: 3
  },
  {
    comment_text: 'Chicago Shed Aquarium is awesome place to visit',
    user_id: 4,
    post_id: 2
  },
  {
    comment_text: 'Planning to go to Duluth, MN',
    user_id: 1,
    post_id: 5
  },
  {
    comment_text: 'VMware is going to release their new hypervisor!',
    user_id: 5,
    post_id: 4
  }
];

const seedComments = () => Comment.bulkCreate(commentdata);

module.exports = seedComments;
