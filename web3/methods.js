const {web3} = require('./index');
const abi = require('./abi');

// Медот получения баланса
module.exports.getBalance = async (ethAddress) => {
    return await web3.eth.getBalance(ethAddress)
};

// Утилиты преобразования значений и т.д.
module.exports.utils = web3.utils;

//Работа со смартконтрактом
//const ABIfile = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"address","name":"_addr","type":"address"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_description","type":"string"}],"name":"addNewProject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getProjectsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"projects","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"description","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
//const contract = new web3.eth.Contract(JSON.parse(ABIfile),'0x05Ca268dB7beeE6791c2145653f2083ac56FE232');
//const externalStorage = new web3.eth.Contract(abi.extStorage,'0xae2ca94eed2207ff98bb73a4c3123413ce620e88');

//const externalStorage = new web3.eth.Contract([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"address","name":"_addr","type":"address"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_description","type":"string"}],"name":"addNewProject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getProjectsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"projects","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"description","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
//    '0x05Ca268dB7beeE6791c2145653f2083ac56FE232');

    //let project;
    //    contract.methods.getProjectsCount().call().then(console.log);


//contract.methods.projects([1]).call().then(console.log);

module.exports.project = async(index) => {
    return await abi.externalStorage.methods.projects([index]).call();
}

module.exports.projectCount = async () => {
    return await abi.externalStorage.methods.getProjectCount().call();
} 

module.exports.rpCount = async () => {
    return await abi.externalStorage.methods.getRPCount().call();
} 

module.exports.RP = async (index) => {
    return await abi.externalStorage.methods.rps(index).call();
} 

module.exports.getBalance = async (address) => {
    return await abi.token.methods.balanceOf(address).call();
} 

module.exports.getAddress = async (login) => {
    return await abi.externalStorage.methods.userAddress(login).call();
} 

module.exports.getProjectData = async (index) => {
    let myData2 = await abi.externalStorage.methods.projects(index).call();
    return myData2.name + '\n' + myData2.description;
}

module.exports.getProjectRPID = async (index) => {
    let myData = await abi.externalStorage.methods.projects(index).call();
    return myData.RPID;
}

module.exports.getRpData = async (index) => {
    let myData = await abi.externalStorage.methods.rps(index).call();
    return 'Наименование:  ' + myData.name + '\n' + 'Расположение:  ' + myData.location + '\n' + 'Описание:  ' + myData.description;
}

module.exports.getRPID = async (login) => {
    myAddress = await abi.externalStorage.methods.userAddress(login).call();
    myUser = await abi.externalStorage.methods.users(myAddress).call();
    return myUser.RPID;
}

module.exports.getUser = async(address) => {
    return await abi.externalStorage.methods.users(address).call();
}
