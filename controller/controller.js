let express = require('express');
let router = express.Router();
let request = require("request");
let cheerio = require('cheerio');
let Comment = require('../models/Comment.js');
let Article = require('../models/Article.js');

router.get('/', function (req, res) {
    res.redirect('/articles');
});

router.get('/scrape', function (req, res) {
    request('http://www.theverge.com/tech', function (error, response, html) {
        let $ = cheerio.load(html);
        let titlesArray = [];
        $('.c-entry-box--compact__title').each(function (i, element) {
            let result = {};
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('hreflet')
        });
        res.redirect('/');
    })
});

router.get('/articles', function (req, res) {
    Article.find().sort({ _id: -1 })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                var artcl = { article: doc };
                res.render('index', artcl);
            }
        });
});

router.get('/readArticle/:id', function (req, res) {
    let articleId = req.params.id;
    let hbsObj = {
        article: [],
        body: []
    };
    Article.findOne({ _id: articleId })
        .populate('comment')
        .exec(function (err, doc) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                hbsObj.article = doc;
                let link = doc.link;
                request(link, function (error, response, html) {
                    let $ = cheerio.load(html);
                    $('.l-col__main').each(function (i, element) {
                        hbsObj.body = $(this).children('.c-entry-content').children('p').text();
                        res.render('article', hbsObj);
                        return false;
                    });
                });
            }

        });
});
router.post('/comment/:id', function (req, res) {
    let user = req.body.name;
    let content = req.body.comment;
    let articleId = req.params.id;
    let commentObj = {
        name: user,
        body: content
    };
    let newComment = new Comment(commentObj);

    newComment.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc._id)
            console.log(articleId)
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { 'comment': doc._id } }, { new: true })
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/readArticle/' + articleId);
                    }
                });
        }
    });
});

module.exports = router;
