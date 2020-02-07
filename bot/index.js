const TelegramBot = require('node-telegram-bot-api');
const API_KEY = require('./bot_key')
const bot = new TelegramBot(API_KEY, {polling: true});
const helper = require('./helper')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const abi = require('../web3/abi')

const {getBalance, utils, project, projectCount, rpCount, RP, getAddress, getProjectData, getRpData} = require('../web3/methods')
const methods = require('../web3/methods')
let myPCount = 0;
let myAddress = '';
//let myProjectCount = 0;
let myProjectData;
let myLastProjectID = 0;
let myLastRpID = 0;
let myLastRpIndex = 0;
bot.on('message', msg => {
    //console.log(msg.text)
    const chatId = helper.getChatID(msg)

    switch (msg.text) {
        case kb.home.projects:
            //console.log(kb.home.projects);
            bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
            .then(async () => {
                
                allProjectCount = await projectCount();
                
                    bot.sendMessage(chatId, 'Всего в системе зарегистрировано проектов: ' + allProjectCount);
                    //console.log(myPCount);
                    let myProjectCount = 0;
                    let myCount = 0;
                    let myRPID = await methods.getRPID(msg.chat.username)
                    //console.log('myRPID: '+ myRPID)
                    while (myCount < allProjectCount) {
                        //console.log('Вход в цикл ' + myCount)
                        let myCurrentProject = await methods.project(myCount)
                            if (myCurrentProject.RPID == myRPID){
                                    bot.sendMessage(chatId,  `${myCurrentProject.ID}   ${myCurrentProject.name}  /proj${myCount}`, {
                                        parse_mode: 'HTML'
                                    });
                                myProjectCount++;
                            }    


                        myCount++;
                    }
                    if (myProjectCount > 0){
                        bot.sendMessage(chatId, 'В Вашем поселении проектов: ' +  myProjectCount)
                    } else {
                        bot.sendMessage(chatId, 'В Вашем поселении проектов не найдено.')
                    }
                    bot.sendMessage(chatId, 'Перейдите по нужной ссылке для получения подробной информации по проекту:...', {
                        reply_markup: {
                            keyboard: keyboard.projects
                        }
                    });
                })
            break;

        case kb.project.link: //связаться с админом проекта. ID проекта в переменной myLastProjectID
                // получить адрес администратора проекта
                bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
                .then(async () => {
                    let myLastProject = await methods.project(myLastProjectID)
                    let myLogin = await methods.getUser(myLastProject.admin)
                    //console.log(myLogin)
                    const html = `
                    ${msg.from.first_name}, Вы можете 
                    <a href="https://t.me/${myLogin.login}">Отправить сообщение автору проекта....</a>
                    `
                    bot.sendMessage(chatId, html, {
                        parse_mode: 'HTML'
                    })

                });
            break;
        
            // Проекты поселения
        case kb.rpdetail.rpprojects:
            bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
            .then(async () => {
                
                allProjectCount = await projectCount();
                
                    //console.log(myLastRpID);
                    let myProjectCount = 0;
                    let myCount = 0;
                    //console.log('myRPID: '+ myRPID)
                    while (myCount < allProjectCount) {
                        //console.log('Вход в цикл ' + myCount)
                        let myCurrentProject = await methods.project(myCount)
                            if (myCurrentProject.RPID == myLastRpID){
                                    bot.sendMessage(chatId,  `${myCurrentProject.ID}   ${myCurrentProject.name}  /proj${myCount}`, {
                                        parse_mode: 'HTML'
                                    });
                                myProjectCount++;
                            }    


                        myCount++;
                    }
                    if (myProjectCount > 0){
                        bot.sendMessage(chatId, 'В Выбранном поселении проектов: ' +  myProjectCount)
                        bot.sendMessage(chatId, 'Перейдите по нужной ссылке для получения подробной информации по проекту:...', {
                            reply_markup: {
                                keyboard: keyboard.projects
                            }
                        });
                        } else {
                        bot.sendMessage(chatId, 'В Выбранном поселении проектов не найдено.',{
                            reply_markup: {
                                keyboard: keyboard.projects
                            }

                        })
                    }
                })

            break;

        case kb.home.rps:
            bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
            .then(async () => {
                
                myPCount = await rpCount();
                
                    bot.sendMessage(chatId, 'В системе зарегистровано поселений: ' + myPCount);
                    bot.sendMessage(chatId, 'Перейдите по нужной ссылке для получения подробной информации по поселению...',{
                        reply_markup: {
                            keyboard: keyboard.rps
                        }
        
                    })

                    //console.log(myPCount);
                    let myCount = 0;
                    while (myCount < myPCount) {
                        let myCurrentProject = await RP(myCount);
                        bot.sendMessage(chatId,  `${myCurrentProject.ID}   ${myCurrentProject.name}  /rps${myCount}`, {
                            parse_mode: 'HTML'
                        });
                        myCount++;
                    }
            })

            break;

        case kb.home.about:
            bot.sendMessage(chatId, 'Программа (бот и смарт-контракт) разработаны для удобства учета вкладов участников поселений родовых поместий в различные проекты.')
            bot.sendMessage(chatId, 'По вопросам участия в проекте обращайтесь к разработчику.')
            let html = `
            ${msg.from.first_name}, Вы можете 
            <a href="https://t.me/alex_sysadm">Отправить сообщение автору бота....</a>
            `
            bot.sendMessage(chatId, html, {
                parse_mode: 'HTML'
            })
            break;
        
        case kb.home.help:
            bot.sendMessage(chatId, 'Бот представляет собой программу, которая обращается в блокчейн Эфириума по определенному адресу смартконтракта и показывает данные по вкладам участников проектов.')
            bot.sendMessage(chatId, 'Предназначен для учета различной деятельности жителей родовых поместий.')
    
            break

        case kb.home.balance:
            bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...',{
                reply_markup:{
                    keyboard: keyboard.balance
                }
            })
            .then(async () => {
                myAddress = await getAddress(msg.chat.username)
                const deposit = await getBalance(myAddress)
                bot.sendMessage(chatId, 'Ваш баланс составляет: ' + deposit + ' токенов KEDRON')
            })
        
            break

        case kb.home.depo:
                bot.sendMessage(chatId, '...Раздел в разработке...',{
                    reply_markup: {
                        keyboard: keyboard.back
                    }
                })
            break;

        case kb.balance.etherscan:
            let html2 = `${msg.from.first_name}, далее Вы можете <a href="${abi.etherscanURL}/token/${abi.tokenAddress}/?a=${myAddress}">перейти на сайт etherscan и посмотреть историю операций</a>`
            bot.sendMessage(chatId, html2, {
                parse_mode: 'HTML',
                reply_markup: { 
                    keyboard: keyboard.back
                }
            })
            break
        case kb.home.adm:
            bot.sendMessage(chatId, '...Раздел в разработке...',{
                reply_markup: {
                    keyboard: keyboard.back
                }
            })
            break

        case kb.back:
            bot.sendMessage(chatId, `Главное меню`, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            });
            break;
        default:
            break;
    }
});


//Обработка команд инфо по проектам
bot.onText(/\/proj(.+)/, (msg, [source, match]) => {
    const chatId = helper.getChatID(msg)
    //console.log(helper.getProjectIDFromCommand(source))
    bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
        .then(async () => {
            myLastProjectID = await helper.getProjectIDFromCommand(source)
            myProjectData = await getProjectData(myLastProjectID)
            bot.sendMessage(chatId, myProjectData, {
                reply_markup: {
                    keyboard: keyboard.project
                }
            })
        })
})

//Обработка команд инфо по поселениям
bot.onText(/\/rps(.+)/, (msg, [source, match]) => {
    const chatId = helper.getChatID(msg)
    //console.log(helper.getProjectIDFromCommand(source))
    bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
        .then(async () => {
            myLastRpID = await helper.getRpIDFromCommand(source)
            myLastRpIndex= await helper.getRpIndexFromCommand(source)
            myProjectData = await getRpData(helper.getRpIndexFromCommand(source))
            bot.sendMessage(chatId, myProjectData,{
                reply_markup: {
                    keyboard: keyboard.rpdetail
                }
            })
        })
})


// Старт
bot.onText(/\/start/, msg => {
    //console.log(msg.chat.username)
    const chatId = helper.getChatID(msg)

    const text = `Привет, ${msg.from.first_name}`
    bot.sendMessage(chatId, text, {
        reply_markup: {
            keyboard: keyboard.home
        }
    })

    //bot.sendMessage(chatId, 'Выберите команду для работы...')
    

})

bot.on ("polling_error" , ( err ) =>  console.log (err));

/* // Ответ бота на любое сообщение пользователя
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const data = msg.text;

    bot.sendMessage(chatId, 'Inline Keyboard', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Помощь',
                        callback_data: 'help'
                    },
                    {
                        text: 'О программе',
                        callback_data: 'about'
                    }
                ],
                [
                    {
                        text: 'Список поселений',
                        callback_data: 'list_rp'
                    },
                    {
                        text: 'Список проектов',
                        callback_data: 'list_proj'
                    }
                ]
            ]
        }
    })
});
bot.on('callback_query', query => {
    //bot.sendMessage(query.message.chat.id, debug(query)) // выводит полный объект query
    //bot.answerCallbackQuery(query.id, `${query.data}`)  // выводит query.data
    //console.log(query);
    switch (query.data) {
        case 'list_rp':
            bot.sendMessage(chatId, 'Список поселений...')
            bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
            .then(async () => {
                
                myPCount = await rpCount();
                
                    bot.sendMessage(chatId, 'В системе зарегистровано поселений: ' + myPCount);
                    //console.log(myPCount);
                    let myCount = 0;
                    while (myCount < myPCount) {
                        let myCurrentProject = await RP(myCount);
                        bot.sendMessage(chatId, myCount + ' ' + myCurrentProject.name);
                        myCount++;
                    }
        
                    bot.sendMessage(chatId, 'Введите номер интересующего Вас поселения и нажмите Enter...')
            })
                
            break;
    
        default:
            break;
    }

    if (query.data == 'help') {
        bot.sendMessage(chatId, 'Бот представляет собой программу, которая обращается в блокчейн Эфириума по определенному адресу смартконтракта и показывает данные по вкладам участников проектов.')
        bot.sendMessage(chatId, 'Предназначен для учета различной деятельности жителей родовых поместий.')
    }

    else if (query.data == 'about') {
        bot.sendMessage(chatId, 'О программе...')
        bot.sendMessage(chatId, 'Разработка ботов для телеграм.')
        const html = `
        ${msg.from.first_name}, Вы можете 
        <a href="https://t.me/alex_sysadm">Отправить сообщение автору бота....</a>
        `
        bot.sendMessage(chatId, html, {
            parse_mode: 'HTML'
        })
        }
});    
/* 

    else if (data == '/list_rp' )  {
        bot.sendMessage(chatId, 'Список поселений...')
        bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
        .then(async () => {
            
            myPCount = await rpCount();
            
                bot.sendMessage(chatId, 'В системе зарегистровано поселений: ' + myPCount);
                //console.log(myPCount);
                let myCount = 0;
                while (myCount < myPCount) {
                    let myCurrentProject = await RP(myCount);
                    bot.sendMessage(chatId, myCount + ' ' + myCurrentProject.name);
                    myCount++;
                }
    
                bot.sendMessage(chatId, 'Введите номер интересующего Вас поселения и нажмите Enter...')

        })

    }



    //Обработка цифрового воода с клавиатуры

    else if (data < myPCount )  {
        bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
            .then(async () => {
                const myRP= await RP(data);
                bot.sendMessage(chatId, 'Поселение: ' + myRP.name)
                bot.sendMessage(chatId, 'Расположение: ' + myRP.location)
                bot.sendMessage(chatId, 'Описание: ' + myRP.description)
                    .catch(error => {
                        bot.sendMessage(chatId, error)
                    })
            })
    }
    
    else if (query.data == '/list_rp') {
        bot.sendMessage(chatId, 'Список проектов поселения...')
        bot.sendMessage(chatId, 'Пожалуйста, подождите несколько секунд...')
        .then(async () => {
            
            myPCount = await projectCount();

                //console.log(myPCount);
                let myCount = 0;
                while (myCount < myPCount) {
                    let myCurrentRP = await RP(myCount);
                    bot.sendMessage(chatId, myCurrentProject.name);
                    bot.sendMessage(chatId, myCurrentProject.location);
                    bot.sendMessage(chatId, myCurrentProject.description);
                    myCount++;
                }

        })
    }



    else {
        bot.sendMessage(chatId, 'Что-то пошло не так... Попробуйте ввести корректную команду...')
            .catch(e => {
                console.log('Ошибка в else: ' + e)
            })
    } */ 





