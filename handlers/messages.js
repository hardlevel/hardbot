const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda','ajude','me ajuda','socorro','urgente']

module.exports = (client) => {
    client.on('messageCreate', async message => {
        console.log(message.author.username + ' - ' + message.channelId)
    });

    client.on('threadCreate', async (thread) => {
        console.log(thread)
        let postMember = thread.ownerId
        
        if (thread.parent.type === 15){
            if (filter.some(substring=>thread.name.includes(substring))){
                client.users.send(postMember, alertForum);
                thread.delete()
            }
        }
        // if (thread.parent.type === ChannelType.GuildForum) {
        //     // When a new forum post is created
        //     console.log(thread.parentId) // The forum channel ID
        //     console.log(thread.id) // The forum post ID
        //     console.log(thread.name) // The name of the forum post
        // }
        // if (thread.parent.type === ChannelType.GuildText) {
        //     console.log(thread.name)
        // }
    })
}