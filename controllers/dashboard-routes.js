const router = require('express').Router();
const greet = require('greet-by-time');
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const moment = require('moment');
var today = moment().format("[Today is: ] dddd, MM/DD/YYYY");
var cloudinary = require('cloudinary').v2;


function getGreeting(username) {
    const hour = new Date().getHours();
    return greet(username, hour);
}

function showUploadWidget() {
    cloudinary.openUploadWidget({
       cloudName: "saysomething",
       uploadPreset: "saysomething",
       sources: [
           "local",
           "url",
           "image_search",
           "google_drive",
           "facebook",
           "instagram",
           "camera"
       ],
       googleApiKey: "<image_search_google_api_key>",
       showAdvancedOptions: true,
       cropping: true,
       multiple: false,
       defaultSource: "local",
       styles: {
           palette: {
               window: "#FFFFFF",
               windowBorder: "#2D62A0",
               tabIcon: "#0078FF",
               menuIcons: "#5A616A",
               textDark: "#000000",
               textLight: "#FFFFFF",
               link: "#0078FF",
               action: "#FF620C",
               inactiveTabIcon: "#0E2F5A",
               error: "#F44235",
               inProgress: "#0078FF",
               complete: "#20B832",
               sourceBg: "#E4EBF1"
           },
           fonts: {
               default: {
                   active: true
               }
           }
       }
   },
    (err, info) => {
      if (!err) {    
        console.log("Upload Widget event - ", info);
      }
     });
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