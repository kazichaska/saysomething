const router = require('express').Router();

const homeRoutes = require('./home-routes');
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard-routes');
const commentRoutes = require('./api/comment-routes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/comments', commentRoutes);

module.exports = router;