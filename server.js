var restify = require('restify')
var redis = require('redis')
var client = redis.createClient(process.env.REDIS_URL)
var server = restify.createServer()

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function (req, res, done) {
	if (req.params.people) {
		client.rpush('people', req.params.people.map(function (p) { return JSON.stringify(p) }), function () {
			console.log('wrote data to the redis \\o/')
		})
	}

	res.send({success: 'woo!'}, 200)
	return done()
})

server.get('/people', function (req, res) {
	var body = ''
	var dedupe = {}

	client.lrange('people', 0, -1, function (err, people) {
			if (err) {

			} else {
				people = people.map(function (p) {
					return JSON.parse(p)
				})
				people.unshift({name: 'Name', role: 'Role', company: 'Company'})
				people.forEach(function (p) {
					if (p.name === 'LinkedIn Member') return
					if (dedupe[p.name]) return
					dedeupe[p.name] = true
					body += p.name + '\t' + p.role + '\t' + p.company + '\n'
				})
				res.writeHead(200, {
				  'Content-Length': Buffer.byteLength(body),
				  'Content-Type': 'text/csv'
				});
				res.write(body);
				res.end();
			}
			return done()
	})
})

server.listen(process.env.PORT, function() {
	console.log('%s listening at %s', server.name, server.url);
});
