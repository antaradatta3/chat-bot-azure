const builder = require('./botbuilder');
const express = require('express');
const greeting = require('./app/recognizer/greeting');
const commands = require('./app/recognizer/commands');
const smiles = require('./app/recognizer/smiles');
const path = require('path');
const azure = require('botbuilder-azure');

const dialog = {
  welcome: require('./app/dialogs/welcome'),
  categories: require('./app/dialogs/categories'),
  explore: require('./app/dialogs/explore'),
  showProduct: require('./app/dialogs/showProduct'),
  choseVariant: require('./app/dialogs/choseVariant'),
  showVariant: require('./app/dialogs/showVariant'),
  addToCart: require('./app/dialogs/addToCart'),
  showCart: require('./app/dialogs/showCart')
};
const documentDbOptions = {
  host: 'https://chatdata.documents.azure.com:443/',
  masterKey:
    'rqBf0Xs2PQe4tsQu4r6QJihcx0SPMTIcqUQpVqEkKkOK9RH1MG5sZEmryiFSQFOe7Jk8BoVStxnl9oLvA59T1g==',
  database: 'botdocs',
  collection: 'botdata'
};

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSFT_APP_PASSWORD
});

const docDbClient = new azure.DocumentDbClient(documentDbOptions);

const cosmosStorage = new azure.AzureBotStorage(
  { gzipData: false },
  docDbClient
);

// const connector = new builder.ChatConnector({
//   appId: "f5c45411-326e-48ad-a7f2-88d079cdfc44",
//   appPassword: "917742e3-948c-498a-9849-83e0af87dfff"
// });

// const bot = new builder.UniversalBot(connector, {
//   persistConversationData: true
// });

var bot = new builder.UniversalBot(connector).set('storage', cosmosStorage);
var intents = new builder.IntentDialog({
  recognizers: [
    commands,
    greeting,
    new builder.LuisRecognizer(
      `https://westeurope.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/8cfd3b6c-86b1-4ec2-8441-7c3f30db9fa2/slots/production/predict?subscription-key=18df0fdeb4d24c5db73310bf9453507a&verbose=false&show-all-intents=false&log=false`
    )
  ],
  intentThreshold: 0.2,
  recognizeOrder: builder.RecognizeOrder.series
});

intents.matches('Greeting', '/welcome');
intents.matches('ShowTopCategories', '/categories');
intents.matches('Explore', '/explore');
intents.matches('Next', '/next');
intents.matches('ShowProduct', '/showProduct');
intents.matches('AddToCart', '/addToCart');
intents.matches('ShowCart', '/showCart');
intents.matches('Checkout', '/checkout');
intents.matches('Reset', '/reset');
intents.matches('Smile', '/smileBack');
//intents.onDefault('/confused');

bot.dialog('/', intents);
// bot.dialog('/', function(session) {
//   console.log('SESSION');
//   session.send('You said ' + session.message.text);
// });
dialog.welcome(bot);
dialog.categories(bot);
dialog.explore(bot);
dialog.showProduct(bot);
dialog.choseVariant(bot);
dialog.showVariant(bot);
dialog.addToCart(bot);
dialog.showCart(bot);

bot.dialog('/confused', [
  function(session, args, next) {
    // ToDo: need to offer an option to say "help"
    if (session.message.text.trim()) {
      session.endDialog(
        "Sorry, I didn't understand you or maybe just lost track of our conversation"
      );
    } else {
      session.endDialog();
    }
  }
]);

bot.on('routing', smiles.smileBack.bind(smiles));

bot.dialog('/reset', [
  function(session, args, next) {
    session.endConversation(['See you later!', 'bye!']);
  }
]);

bot.dialog('/checkout', [
  function(session, args, next) {
    const cart = session.privateConversationData.cart;

    if (!cart || !cart.length) {
      session.send(
        'I would be happy to check you out but your cart appears to be empty. Look around and see if you like anything'
      );
      session.reset('/categories');
    } else {
      session.endDialog('Alright! You are all set!');
    }
  }
]);

const app = express();

app.get(`/`, (_, res) => res.sendFile(path.join(__dirname + '/index.html')));
// app.get(`/`, (_, res) =>
//   res.sendFile('D:\\poc\\chatbot\\ecommerce-chatbot/index.html')
// );
app.post('/api/messages', connector.listen());

app.listen(process.env.PORT || process.env.port || 3978, () => {
  console.log('Express HTTP is ready and is accepting connections at 3978');
});
