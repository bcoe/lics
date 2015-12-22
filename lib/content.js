(function() {

	var imageUrl = '',
		request = {people: []};

	setInterval(function() {
		if (request.people.length) {
			setTimeout(function () {
				request.people = []
			}, 0);
		}

		chrome.extension.sendRequest({people: request.people}, function(response) {
			if (!response) return;

			if (typeof(response) == 'string') {
				alert(response);
			} else {
				$('.bd').each(function () {
					var bd = $(this)
					var name = bd.find('.main-headline').text().trim()
					if (name.length) {
						var description = bd.find('.description').text().trim()
						var title = bd.find('.title').text().trim()
						var company = null
						description = description.split(' at ')
						title = title.split(' at ')
						if (description.length === 2) company = description[1]
						else if (title.length === 2) company = title[1]

						console.log('name:', name)
						if (description[0]) console.log('role:', description[0])
						if (company) console.log('company:', company)
						console.log('------')

						if (company) {
							request.people.push({
								name: name,
								role: description[0],
								company: company
							})
						}
					}
				})
			}
		});
	}, 200);
})();
