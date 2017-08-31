var User = require('./models/user');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('helllllloooo');
  });

  app.get('/:username/:password', (req, res) => {
    var newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password;

    console.log(newUser.local.username + " > " + newUser.local.password);

    newUser.save((e) => {
      if (e) {
        throw e;
      }
      res.send('Success');
    })
  });
}
