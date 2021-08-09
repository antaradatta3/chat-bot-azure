const search = require('../search/search');

module.exports = function(bot) {
  bot.dialog('/categories', [
    function(session, args, next) {
      console.log('Called categories');
      session.sendTyping();

      search.listTopLevelCategories().then(value => next(value));
    },
    function(session, args, next) {
      console.log('Called categories', args);
      const message = (args || [])
        .map(v => v)
        .filter(t => t !== 'Uncategorized')
        .join(', ');

      session.endDialog('We have ' + message);
    }
  ]);
  bot.dialog('/category', [
    function(session, args, next) {
      console.log('Called category');
      session.sendTyping();

      search.findCategoryByTitle().then(value => next(value));
    },
    function(session, args, next) {
      console.log('Called category', args);
      const message = (args || [])
        .map(v => v)
        .filter(t => t !== 'Uncategorized')
        .join(', ');

      session.endDialog('We have ' + message);
    }
  ]);
};
