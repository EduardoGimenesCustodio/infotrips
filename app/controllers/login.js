module.exports.login = function(app, req, res){
	if (!req.session.loggedin) {
		res.render('login/login', {validacao: {}});
	} else {
		res.redirect('/perfil');
	}
}

module.exports.login_usuario = function(app, req, res){
	var email = req.body.email_usuario;
	var senha = req.body.senha_usuario;
	if (email && senha) {
		var connection = app.config.dbConnection();
		var usuarioModel = new app.app.models.UsuarioDAO(connection);

		var crypto = require('crypto');
		var alg = 'aes-256-ctr';
		var pwd = 'abcdabcbcbcdabcdabadabcdabcdabcd';
		
		function decrypt(senha) {
			var parts = senha.split(':');
			var decipher = crypto.createDecipheriv(alg, pwd, new Buffer(parts[0], 'hex'));
			var plain = decipher.update(parts[1], 'hex', 'utf8') + decipher.final('utf8');
			return plain;
		}

		usuarioModel.getSenhaUsuario(email, function(error, senha_cadastrada){
			if (senha_cadastrada.length > 0) {
				var senha_usuario = senha_cadastrada[0].senha_usuario;
				senha_usuario = decrypt(senha_usuario);

				if (senha === senha_usuario){
					usuarioModel.loginUsuario(email, function(error, result){
						if (result.length > 0) {
							req.session.loggedin = true;
							req.session.email = email;
							res.redirect('/?notificacao=Login Realizado');
						} else {
							var erro = 'E-mail ou senha incorretos';
							res.render('login/login', {validacao: erro});
						}
						res.end();
					});
				} else {
					var erro = 'E-mail ou senha incorretos';
					res.render('login/login', {validacao: erro});
					res.end();
				}
			} else {
				var erro = 'E-mail ou senha incorretos';
				res.render('login/login', {validacao: erro});
				res.end();
			}
		});
	} else {
		res.end();
	}
}

// Admin

module.exports.login_adm = function(app, req, res){
	if (!req.session.loggedinAdmin) {
		res.render('login/login_admin', {validacao: {}});
	} else {
		res.redirect('/admin');
	}
}

module.exports.login_admin = function(app, req, res){
	var email = req.body.email_admin;
	var senha = req.body.senha_admin;
	if (email && senha) {
		var connection = app.config.dbConnection();
		var adminModel = new app.app.models.AdminDAO(connection);

		var crypto = require('crypto');
		var alg = 'aes-256-ctr';
		var pwd = 'abcdabcbcbcdabcdabadabcdabcdabcd';
		
		function decrypt(senha) {
			var parts = senha.split(':');
			var decipher = crypto.createDecipheriv(alg, pwd, new Buffer(parts[0], 'hex'));
			var plain = decipher.update(parts[1], 'hex', 'utf8') + decipher.final('utf8');
			return plain;
		}

		adminModel.getSenhaAdmin(email, function(error, senha_cadastrada){
			if (senha_cadastrada.length > 0) {
				var senha_admin = senha_cadastrada[0].senha_admin;
				senha_admin = decrypt(senha_admin);

				if (senha === senha_admin){
					adminModel.loginAdmin(email, function(error, result){
						if (result.length > 0) {
							req.session.loggedinAdmin = true;
							req.session.email_admin = email;
							res.redirect('/admin?notificacao=Login Realizado');
						} else {
							var erro = 'E-mail ou senha incorretos';
							res.render('login/login_admin', {validacao: erro});
						}
						res.end();
					});
				} else {
					var erro = 'E-mail ou senha incorretos';
					res.render('login/login_admin', {validacao: erro});
					res.end();
				}
			} else {
				var erro = 'E-mail ou senha incorretos';
				res.render('login/login_admin', {validacao: erro});
				res.end();
			}
		});
	} else {
		res.end();
	}
}