var restify = require('restify')
var redis = require('redis')
var client = redis.createClient(process.env.REDIS_URL)
var server = restify.createServer()

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function (req, res) {
	if (req.params.people) {
		client.rpush('people', req.params.people.map(function (p) { return JSON.stringify(p) }), function () {
			console.log('wrote data to the redis \\o/')
		})
	}

	res.send({success: 'woo!'}, 200)
})

server.listen(process.env.PORT, function() {
	console.log('%s listening at %s', server.name, server.url);
});
