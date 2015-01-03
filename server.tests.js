var superagent = require('superagent'),
	expect = require('expect.js');

describe('api.extrememoderation.tv rest server', function(){
	var auth,
		blog_id,
		blog_slug;

	it('login and get token', function(done){
		superagent.post('http://localhost:3000/login')
			.send({
				username: 'extrememoderation',
				password: 'yeah-this-is-not-really-my-password'
			})
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.token.length).to.be.above(0);
				auth = res.body;
				done();
			});
	});

	it('create a blog post', function(done){
		superagent.post('http://localhost:3000/v1/blog')
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.send({
				title: 'This is a test blog post',
				body: 'This is a test blog post (body)',
				author: 'ExtremeModeration'
			})
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body._id.length).to.eql(24);
				blog_id = res.body._id;
				expect(res.body.slug).to.eql('this-is-a-test-blog-post');
				blog_slug = res.body.slug;
				done();
			});
	});

	it('list most recent blog posts', function(done){
		superagent.get('http://localhost:3000/v1/blogs')
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.length).to.be.above(0);
				expect(res.body.length).to.be.below(11);
				done();
			});
	});

	it('get blog post by id', function(done){
		superagent.get('http://localhost:3000/v1/blog/'+blog_id)
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body._id.length).to.eql(24);
				expect(res.body._id).to.eql(blog_id);
				expect(res.body.slug).to.eql(blog_slug);
				done();
			});
	});

	it('get blog post by slug', function(done){
		superagent.get('http://localhost:3000/v1/blog/with-slug/'+blog_slug)
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body._id.length).to.eql(24);
				expect(res.body._id).to.eql(blog_id);
				expect(res.body.slug).to.eql(blog_slug);
				done();
			});
	});

	it('update blog post', function(done){
		superagent.put('http://localhost:3000/v1/blog/'+blog_id)
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.send({
				title: 'This is a test blog post xxx',
				body: 'This is a test blog post (body) xxx',
				author: 'ExtremeModeration'
			})
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.message).to.eql('success');
				done();
			});
	});

	it('delete blog post', function(done){
		superagent.del('http://localhost:3000/v1/blog/'+blog_id)
			.set('x-access-token', auth.token)
			.set('x-key', auth.user.username)
			.end(function(e, res){
				expect(e).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(res.body.message).to.eql('success');
				done();
			});
	});
});