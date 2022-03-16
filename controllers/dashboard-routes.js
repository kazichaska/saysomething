const router = require('express').Router();
const greet = require('greet-by-time');
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const moment = require('moment');
var today = moment().format("[Today is: ] dddd, MM/DD/YYYY");

function getGreeting(username) {
    const hour = new Date().getHours();
    return greet(username, hour);
}

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'contents',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', {
                posts,
                loggedIn: req.session.loggedIn,
                // loggedIn: true
                username: req.session.username,
                greeting: getGreeting(req.session.username),
                moment: today,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: [
            'id',
            'contents',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (dbPostData) {
                const post = dbPostData.get({ plain: true });
                res.render('edit-post', {
                    post,
                    loggedIn: req.session.loggedIn
                    // loggedIn: true
                });
            } else {
                res.status(404).end();
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;