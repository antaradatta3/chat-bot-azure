# UPDATE 2/2/2018

* Updated to use Moltin v2 API to generate search indexes. Please make sure you re-create your Moltin store using the most recent version of [the import scripts](https://github.com/pveller/adventureworks-moltin) as there are breaking changes in the data layout.
* LUIS model was re-exported and is now in the 2.1.0 schema version.
* Moved from restify to express
* Also, Microsoft is discontinuing the Recommendations API preview in February 2018. The alternative is to deploy the [Recommendations Solution](https://gallery.cortanaintelligence.com/Tutorial/Recommendations-Solution) template, but it does not yet support the frequently bought together algorithm that the bot was using. The deployment of a solution template is aslo a more involved process so I decided to drop recommendations for now. The recommendation code is still there and is just not used by the dialog flow at the moment.

Note: the bot is still using the original State API that was deprecated. It works, but the recommendation from Microsoft is to implement a [custom state data](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-state-azure-cosmosdb).

# E-Commerce Chatbot

An example of a chatbot built with [Microsoft Bot Framework](https://dev.botframework.com/) and featuring e-commerce capabilities via:

* [Moltin](https://moltin.com)
* [Azure Search](https://azure.microsoft.com/en-us/services/search)
* ~[Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api)~
* [LUIS](https://www.microsoft.com/cognitive-services/en-us/language-understanding-intelligent-service-luis)
* [Text Analytics](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api)

I presented this bot on [API Strat](http://boston2016.apistrat.com/) in Boston as an example of a [smart app built with cognitive APIs](http://boston2016.apistrat.com/speakers/pavel-veller). This bot is also going to [SATURN](https://saturn2017.sched.com/event/9k2m) and [SYNTAX](https://2017.syntaxcon.com/session/building-smarter-apps-with-cognitive-apis/).

## Video

[![Ecommerce Chatbot Video](/img/screencast.png)](https://www.youtube.com/watch?v=uDar3aLdM_M)

## How To Run

If you would like to run it, you would need:

* A [Moltin](https://moltin.com) subscription with the [Adventure Works](https://msftdbprodsamples.codeplex.com/releases/view/125550) data (I previously [shared scripts](https://github.com/pveller/adventureworks-moltin) to import Adventure Works data into Moltin)
* [Azure Search](https://azure.microsoft.com/en-us/services/search) service with three indexes - `categories`, `products`, and `variants`. You can find the index definitions and the script that can set up everything you need [here](/indexes)
* ~[Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api) endpoint with the FBT (frequently bought together) model trained on historical orders. Here's the [instruction on how to set it all up](/recommendations)~
* Trained [LUIS](https://www.microsoft.com/cognitive-services/en-us/language-understanding-intelligent-service-luis) model for the intents that require NLU to be recognized. You can import [the app that I trained](/luis) to get a head start

Deploy your bot (I used [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)) and register it with the [dev.botframework.com](https://dev.botframework.com/).

Set the following environment variables:

* `MICROSOFT_APP_ID` - you will get it from the [dev.botframework.com](https://dev.botframework.com/) during registration
* `MICROSFT_APP_PASSWORD` - you will get it from the [dev.botframework.com](https://dev.botframework.com/) during registration
* ~`RECOMMENDATION_API_KEY` - your API key to the [Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api) service from the [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/)~
* ~`RECOMMENDATION_MODEL`- you can create multiple recommendation models and this way you can choose which one the bot will use for suggestions~
* ~`RECOMMENDATION_BUILD` - a given model (your product catalog, historical transactions, and business rules) can have multiple recommendation builds and this is how you tell which one the bot will use~
* `SEARCH_APP_NAME` - the name of your [Azure Search](https://azure.microsoft.com/en-us/services/search) service. The code assumes that you have all three indexes in the same Azure Search resource
* `SEARCH_API_KEY`- your API key to the [Azure Search](https://azure.microsoft.com/en-us/services/search) service
* `LUIS_ENDPOINT` - the URL of your published LUIS model. Please keep the `Add verbose flag` on and remove `&q=` from the URL. THe bot framework will add it.
* `SENTIMENT_API_KEY` - your API key to the [Text Analytics](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) service.
* `SENTIMENT_ENDPOINT` - the enpoint of yout [Text Analytics](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) service. Defaults to `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`

If you would like to connect the [Bing Spell Check](https://www.microsoft.com/cognitive-services/en-us/bing-spell-check-api) service, you would do so in LUIS when publishing your endpoint. This integration is transparent to the app and all you do is provision your Azure subscription key to the service and connect it to your LUIS app.

## To-Do

* The shopping cart is currently kept in the bot's memory (`session.privateConversationData.cart`) and does not sync back to Moltin
* Checkout process is not integrated with Moltin
* The bot is not multi-lingual

## License

MIT
