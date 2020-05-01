const Telegraf = require('telegraf')
const axios = require('axios')

const bot = new Telegraf ('')

const apikey = '17d65894920cf920385bd74de4dd626fe3a548620942416ea83b84e96604fd97'

const startMessage = (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, 'Добрый день! Крипто бот расскажет вам о курсах криптовалюты. Воспользуйтесь кнопками', 
    {
        reply_markup:{
            inline_keyboard:[
                [
                    { text: 'Курс криптовалют', callback_data: 'price'}
                ],
                [
                    { text: 'CoinMarketCap', url: 'https://coinmarketcap.com'}
                ],
                [
                    { text: 'Информация о боте' , callback_data: 'info'}
                ]
            ]
        }
    })
}

bot.start( async(ctx) => {
    bot.telegram.sendAction(ctx.chat.id, "u")
    startMessage(ctx)
})

bot.action('price', async(ctx) => {
    ctx.deleteMessage()
    bot.telegram.sendMessage(ctx.chat.id, 'Выберите криптовалюту', 
    {
        reply_markup:{
            inline_keyboard:
            [
                [
                    {text: "BTC", callback_data: "price-BTC"},
                    {text: "ETH", callback_data: "price-ETH"}
                ],
                [
                    {text: "BCH", callback_data: "price-BCH"},
                    {text: "LTC", callback_data: "price-LTC"}
                ],
                [
                    {text: "Вернуться", callback_data: "start"}
                ]
            ]
        }
    })
})

bot.action('start', ctx => {
    ctx.deleteMessage()
    startMessage(ctx)
})

let crypto = ['price-BTC', 'price-ETH','price-BCH','price-LTC']

bot.action(crypto, async ctx => {
    let symbol = ctx.match.split('-')[1]
    
    try{
        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BCH,LTC&tsyms=USD,EUR&api_key=${apikey}`)
        const priceData = (res.data.DISPLAY[symbol].USD)
        let message = 
        `
        Symbol: ${symbol}
        Price: ${priceData.PRICE}
        Open: ${priceData.OPENDAY}
        High: ${priceData.HIGHDAY}
        Low: ${priceData.LOWDAY}
        Supply: ${priceData.SUPPLY}
        `

        ctx.deleteMessage()
        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup:{
                inline_keyboard:[
                    [
                        { text: "Вернуться", callback_data: 'price'}
                    ]
                ]
            }
        })
    }catch(e){
        console.log(e)
        ctx.reply('Error')
    }
})

bot.action("info", ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Информация о боте', {
        reply_markup: {
            keyboard: 
            [
                [
                    { text: "API" },
                    { text: "Создатель бота" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
})

bot.hears("API", (ctx) => {
    ctx.reply("Бот создан с помощью API Cryptocompare")
})

bot.hears("Создатель бота", (ctx) => {
    ctx.reply("Создал бота @sakenclique")
})

bot.launch()
