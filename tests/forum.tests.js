module.exports = function(superagent, expects, auth) {
	describe('/v1/forum(s) tests', function(){
		var forum_id, forum_slug,
			thread_id, thread_slug,
			message_id;

		it('create a forum', function(done){
			superagent.post('http://localhost:3000/v1/forum')
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({ name: 'Automated test forum'})
				.end(function(e, result) {
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body._id.length).to.eql(24);
					forum_id = result.body._id;
					expect(result.body.slug).to.eql('automated-test-forum');
					forum_slug = result.body.slug;
					done();
				});
		});

		it('get list of forums', function(done){
			superagent.get('http://localhost:3000/v1/forums')
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.length).to.be.above(0);
					done();
				});
		});

		it('create thread in forum', function(done){
			superagent.post('http://localhost:3000/v1/forum/'+forum_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({name: 'Automated test thread'})
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body._id.length).to.eql(24);
					thread_id = result.body._id;
					expect(result.body.slug).to.eql('automated-test-thread');
					thread_slug = result.body.slug;
					done();
				});
		});

		it('get the list of threads in the forum', function(done){
			superagent.get('http://localhost:3000/v1/forum/'+forum_id+'/threads')
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body.length).to.eql(1);
					done();
				});
		});

		it('create message in thread', function(done){
			superagent.post('http://localhost:3000/v1/forum/'+forum_id+'/thread/'+thread_id)
				.set('x-access-token', auth.token)
				.set('x-key', auth.user.username)
				.send({
					body: 'This is some text generated by the automated testing...'
				})
				.end(function(e, result){
					expect(e).to.eql(null);
					expect(typeof result.body).to.eql('object');
					expect(result.body._id.length).to.eql(24);
					message_id = result.body._id;
					done();
				});
		});
	});
}
