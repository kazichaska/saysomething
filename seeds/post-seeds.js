const { Post } = require('../models');

const postdata = [
  {
    movietitle: 'Donec posuere metus vitae ipsum.',
    contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
    user_id: 2
  },
  {
    movietitle: 'Morbi non quam nec dui luctus rutrum.',
    contents: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    user_id: 3
  },
  {
    movietitle: 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.',
    contents: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
    user_id: 1
  },
  {
    movietitle: 'Nunc purus.',
    contents: 'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor',
    user_id: 5
  },
  {
    movietitle: 'Pellentesque eget nunc.',
    contents: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia',
    user_id: 4
  }
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;
