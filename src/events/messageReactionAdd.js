/* eslint-disable max-len */
'use strict';

/**
 * Event MessageReactionAdd
 */
class MessageReactionAdd {
  /**
  * Launch script
  * @param {MessageReaction} messageReaction - message reaction
  * @param {User} user - user
  */
  async launch(messageReaction, user) {
    /**
     * Check if user is a bot
     */
    if (user.bot) return;
    /**
     * Check emoji reaction name
     */
    if (['left_arrow', 'right_arrow'].includes(messageReaction.emoji.name)) {
      /**
       * If value is object
       */
      if (!this.anime[messageReaction.message.guild.id]) {
        this.anime[messageReaction.message.guild.id] = {};
      };
      /**
       * If there is a message
       */
      if (!this.anime[messageReaction.message.guild.id].message) return;
      /**
       * If this message is deleted
       */
      if (messageReaction.message.channel.messages.fetch(this.anime[messageReaction.message.guild.id].message.id).deleted) return;
      /**
       * Check if message is message reaction
       */
      if (messageReaction.message.id !==
      this.anime[messageReaction.message.guild.id].message.id) return;
      /**
       * Get data
       */
      const data = this.anime[messageReaction.message.guild.id].data;
      /**
       * Switch with emojis
       */
      switch (messageReaction.emoji.name) {
        case 'left_arrow':
          /**
           * Check if pagination is first or latest
           */
          if (this.anime[messageReaction.message.guild.id].pagination === 0) {
            this.anime[messageReaction.message.guild.id].pagination =
          data.length-1;
          } else {
            this.anime[messageReaction.message.guild.id].pagination =
        this.anime[messageReaction.message.guild.id].pagination-1;
          };
          /**
           * Send message
           */
          if (this.anime[messageReaction.message.guild.id].type === 'anime') {
            this.anime[messageReaction.message.guild.id].message.edit({
              embed: {
                color: '#2F3136',
                // eslint-disable-next-line max-len
                title: data[this.anime[messageReaction.message.guild.id].pagination].romaji +
              '  -  ID: ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id,
                description: data[
                // eslint-disable-next-line max-len
                    this.anime[messageReaction.message.guild.id].pagination].description || 'aucune donnée',
                thumbnail: data[this.anime[messageReaction.message.guild.id].pagination].affiche ?
                  {url: encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].affiche)} :
                  {},
                image: data[this.anime[messageReaction.message.guild.id].pagination].image ?
                  {url: encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].image)} :
                  {},
                fields: [
                  {
                    name: 'episodes',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].episodes || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'statut',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].statut || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'licence',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].licence || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'saison',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].statut || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'studio',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].studio || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'producteur',
                    value: data[
                    // eslint-disable-next-line max-len
                        this.anime[messageReaction.message.guild.id].pagination].producteur || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'source',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].source || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'durée',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].duree || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'categorie',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].categorie || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'format',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].format || 'aucune donnée',
                  },
                  {
                    name: 'pays',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].pays || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'adulte',
                    value: data[
                    // eslint-disable-next-line max-len
                        this.anime[messageReaction.message.guild.id].pagination].adulte===0?
                    'Non' : 'Oui',
                    inline: true,
                  },
                  {
                    name: 'liked',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].liked || 'aucune donnée',
                    inline: true,
                  },
                ],
                footer: {
                  // eslint-disable-next-line max-len
                  text: `Powered by Anemy - page ${this.anime[messageReaction.message.guild.id].pagination+1}/${data.length}`,
                  icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
                },
              },
            });
          } else {
            this.anime[messageReaction.message.guild.id].message.edit({
              embed: {
                color: '#2F3136',
                title: data[this.anime[messageReaction.message.guild.id].pagination].prenom +
              ' '+
              data[this.anime[messageReaction.message.guild.id].pagination].nom +
              '  -  ID: ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id + ' · ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id_page.slice(1, data[this.anime[messageReaction.message.guild.id].pagination].id_page.length-1),
                description: data[
                    this.anime[messageReaction.message.guild.id].pagination].biographie || 'aucune donnée',
                thumbnail: {
                  url: data[this.anime[messageReaction.message.guild.id].pagination].image ?
                    encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].image) :
                    'https://cdn.anemy.fr/staff/affiche/SANS-IMAGE.png',
                },
                fields: [
                  {
                    name: 'native',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].native || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'alternative',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].alternative|| 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'liked',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].liked || 'aucune donnée',
                    inline: true,
                  },
                ],
                footer: {
                  // eslint-disable-next-line max-len
                  text: `Powered by Anemy - page ${this.anime[messageReaction.message.guild.id].pagination+1}/${data.length}`,
                  icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
                },
              },
            });
          };
          break;
        case 'right_arrow':
          /**
           * Check if pagination is first or latest
           */
          if (this.anime[messageReaction.message.guild.id].pagination === data.length-1) {
            this.anime[messageReaction.message.guild.id].pagination = 0;
          } else {
            this.anime[messageReaction.message.guild.id].pagination =
        this.anime[messageReaction.message.guild.id].pagination+1;
          };
          /**
           * Send message
           */
          if (this.anime[messageReaction.message.guild.id].type === 'anime') {
            this.anime[messageReaction.message.guild.id].message.edit({
              embed: {
                color: '#2F3136',
                // eslint-disable-next-line max-len
                title: data[this.anime[messageReaction.message.guild.id].pagination].romaji +
              '  -  ID: ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id,
                description: data[
                    // eslint-disable-next-line max-len
                    this.anime[messageReaction.message.guild.id].pagination].description || 'aucune donnée',
                thumbnail: data[this.anime[messageReaction.message.guild.id].pagination].affiche ?
                  {url: encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].affiche)} :
                  {},
                image: data[this.anime[messageReaction.message.guild.id].pagination].image ?
                  {url: encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].image)} :
                  {},
                fields: [
                  {
                    name: 'episodes',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].episodes || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'statut',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].statut || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'licence',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].licence || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'saison',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].statut || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'studio',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].studio || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'producteur',
                    value: data[
                    // eslint-disable-next-line max-len
                        this.anime[messageReaction.message.guild.id].pagination].producteur || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'source',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].source || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'durée',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].duree || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'categorie',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].categorie || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'format',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].format || 'aucune donnée',
                  },
                  {
                    name: 'pays',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].pays || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'adulte',
                    value: data[
                    // eslint-disable-next-line max-len
                        this.anime[messageReaction.message.guild.id].pagination].adulte===0?
                    'Non' : 'Oui',
                    inline: true,
                  },
                  {
                    name: 'liked',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].liked || 'aucune donnée',
                    inline: true,
                  },
                ],
                footer: {
                  // eslint-disable-next-line max-len
                  text: `Powered by Anemy - page ${this.anime[messageReaction.message.guild.id].pagination+1}/${data.length}`,
                  icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
                },
              },
            });
          } else if (this.anime[messageReaction.message.guild.id].type === 'personnage') {
            this.anime[messageReaction.message.guild.id].message.edit({
              embed: {
                color: '#2F3136',
                title: data[this.anime[messageReaction.message.guild.id].pagination].prenom +
              ' '+
              data[this.anime[messageReaction.message.guild.id].pagination].nom +
              '  -  ID: ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id + ' · ' +
              data[this.anime[messageReaction.message.guild.id].pagination].id_page.slice(1, data[this.anime[messageReaction.message.guild.id].pagination].id_page.length-1),
                description: data[
                    this.anime[messageReaction.message.guild.id].pagination].biographie || 'aucune donnée',
                thumbnail: {
                  url: data[this.anime[messageReaction.message.guild.id].pagination].image ?
                    encodeURI(data[this.anime[messageReaction.message.guild.id].pagination].image) :
                    'https://cdn.anemy.fr/staff/affiche/SANS-IMAGE.png',
                },
                fields: [
                  {
                    name: 'native',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].native || 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'alternative',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].alternative|| 'aucune donnée',
                    inline: true,
                  },
                  {
                    name: 'liked',
                    value: data[
                        this.anime[messageReaction.message.guild.id].pagination].liked || 'aucune donnée',
                    inline: true,
                  },
                ],
                footer: {
                  // eslint-disable-next-line max-len
                  text: `Powered by Anemy - page ${this.anime[messageReaction.message.guild.id].pagination+1}/${data.length}`,
                  icon_url: 'https://gblobscdn.gitbook.com/spaces%2F-M4jTJ1TeTR2aTI4tuTG%2Favatar-1586713303918.png?generation=1586713304401821&alt=media',
                },
              },
            });
          };
          break;
      };
    };
  };
};

module.exports = MessageReactionAdd;
