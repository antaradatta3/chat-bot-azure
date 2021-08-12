module.exports = function(bot) {
  bot.dialog('/welcome', [
    function(session, args, next) {
      console.log('INSIDE DIALOG');
      const lastVisit = session.userData.lastVisit;

      session.send(['Hello!', 'Hi there!', 'Hi!']);

      if (!lastVisit) {
        session.send('Our store carries electronics, clothing, jewelery etc');
        session.userData = Object.assign({}, session.userData, {
          lastVisit: new Date()
        });
        session.save();
      } else {
        session.send("Glad you're back!");
      }

      session.endDialog('How can I help you?');
    }
  ]);
};
