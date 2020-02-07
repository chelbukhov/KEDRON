const kb = require('./keyboard-buttons')

module.exports = {
    home: [
        [kb.home.balance],
        [kb.home.projects, kb.home.depo],
        [kb.home.rps, kb.home.adm],
        [kb.home.help, kb.home.about]
        
    ],
    balance: [
        [kb.balance.etherscan],
        [kb.back]
    ],
    projects: [
        [kb.back]
    ],
    project: [
        [kb.project.link],
        [kb.back]
    ],
    rps: [
        [kb.back]
    ],
    rpdetail: [
        [kb.rpdetail.rpprojects],
        [kb.back]
    ],
    rod_pos: [

    ],
    etherscan: [
        [kb.etherscan],
        [kb.back]
    ],
    admin: [
        [kb.admin.info],
        [kb.back]
    ],
    back: [
        [kb.back]
    ]
}