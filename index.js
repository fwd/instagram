const _ = require('lodash');
const server = require('@fwd/server')

/**
* Identification
*/

var identify = {

    categoryFinder(contact) {
        if (this.checkForTopics(contact, ["photography", "photographer"])) return "Photographer"
        if (this.checkForTopics(contact, ["realestate", "real estate", "realtor", "listing", "broker", "properties", "realty"])) return "Real Estate"
        if (this.checkForTopics(contact, ["lifestyle", "luxury", "model", "blogger", "fashion", "travel", "influencer", "youtube"])) return "Influencer"
        if (this.checkForTopics(contact, ["restaurant", "food truck", "foodtruck", "catering", "chef", "cookie", "baked"])) return "Restaurant"
        if (this.checkForTopics(contact, ["makeup", "artist", "owner", "entrepreneur", "founder", "co-founder", "stylist"])) return "Entrepreneur"
        if (this.checkForTopics(contact, ["lawn", "lawn care", "gardening"])) return "Lawn Service"
        if (this.checkForTopics(contact, ["luxury cars", "car sale"])) return "Automobile"
        if (this.checkForTopics(contact, ["flower", "floral", "nursery"])) return "Flowers"
        if (this.checkForTopics(contact, ["tattoo"])) return "Tattoo"
        if (this.checkForTopics(contact, ["brand"])) return "Brand"
        if (this.checkForTopics(contact, ["apparel", "ecommerce", "clothing", "store", "shopify"])) return "eCommerce"
        if (this.checkForTopics(contact, ["lawyer", "attorney"])) return "Law"
        if (this.checkForTopics(contact, ["producer", "dj"])) return "Artist"
        if (this.checkForTopics(contact, ["certified"])) return "Professional"
        return "n/a"
    },

    kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    },

    checkForTopics(item, topics) {
        let name = item.fullName ? item.fullName.toLowerCase() : ''
        let bio = item.bio ? item.bio.toLowerCase() : ''
        let instagram = item.instagram ? item.instagram.toLowerCase() : ''
        let tags = item.tags ? item.tags.join(',').toLowerCase() : ''
        let found = []
        topics.forEach((topic) => {
            if (
                name.includes(topic) || 
                bio.includes(topic) ||
                instagram.includes(topic) ||
                tags.includes(topic)
            ) found.push(topic)
        })
        return _.size(found)
    },

    whoIsPublic(contact) {
        contact = this.whoIs(contact)
        // contact.avatar = contact.avatarHD
        delete contact.likes
        delete contact.greeting
        delete contact.followerCount
        // delete contact.avatarHD
        // delete contact.isPrivate
        return contact
    },

    whoIs(contact) {

        if (contact.name || contact.firstName) {

            if (name) contact.name = name.name

            if (name && name.first) contact.firstName = name.first

        }
        
        if (contact.username && contact.posts && contact.posts.length) {

            let followerCount = contact.followers || contact.instagramFollowers

            _.each(contact.posts, (post, i) => {
                contact.posts[i].engagementRate = (post.likes + (post.commentsCount)) / followerCount * 100
                contact.posts[i].engagementRate = Math.ceil(post.engagementRate * 100) / 100;
                contact.posts[i].advertisingValue = ( (post.likes + (post.commentsCount)) / 1000) * 10
                contact.posts[i].advertisingValue = Math.ceil(post.advertisingValue * 100) / 100;
            })

            let likes = contact.posts.map(a => a.likes)
            let sum = likes.reduce((a, b) => a + b);
            let averageLike = sum / likes.length;
            let contactFollowers = Math.ceil(followerCount / 100) * 100; // round to nearest hundred
            
            // contact.averageLikeRounded = Math.ceil(averageLike / 100) * 100; // round to nearest hundred
            contact.averageLike = parseInt(Math.max( Math.round(averageLike * 10) / 10, 2.8 ).toFixed(2)) // round to nearest hundred
            // let engagementRate = Math.floor(averageLike/contactFollowers*100);
            // let engagementRateRaw = averageLike / contactFollowers * 100

            contact.likes = likes
            contact.averageLike = averageLike
            contact.followerCount = contactFollowers
            // contact.followerCountFormatted = this.kFormatter(contactFollowers)

            contact.engagementRate = contact.posts.map(a => a.engagementRate).reduce((a, b) => a + b) / contact.posts.length
            contact.engagementRate = parseInt(Math.max( Math.round(contact.engagementRate * 10) / 10, 2.8 ).toFixed(2))

            contact.advertisingValue = contact.posts.map(a => a.advertisingValue).reduce((a, b) => a + b) / contact.posts.length
            contact.advertisingValue = Math.ceil(contact.advertisingValue * 100) / 100

            // value
            let multipliyer = 1;

            // followers
            if (contactFollowers > 10000 && contactFollowers < 100000) multipliyer += 10
            if (contactFollowers > 100000 && contactFollowers < 1000000) multipliyer += 20
            if (contactFollowers > 1000000 && contactFollowers < 10000000) multipliyer += 30

            // engagement
            if (contact.engagementRate > 10) multipliyer += 10

            contact.advertisingValue = contact.advertisingValue * multipliyer
            // contact.advertisingValueFormatted = contact.advertisingValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')

            contact.popularPost = _.last(_.sortBy(contact.posts, ['likes']))

        } 

        contact.occupation = this.categoryFinder(contact)

        return contact

    }

}

/**
* IG Scrapper
*/

function scrape(username, limit) {
  return new Promise((resolve, reject) => {
    const instaTouch = require('./lib/index');
    let options = {
        count: limit || 60,
        download: false,
        mediaType: "all",
        filetype: "both"
    };
    (async () => {
        let user;
        try {
            user = await instaTouch.user(username, options)
            var response = {}
            response = user.profile
            response.posts = user._collector
            resolve(response)
        } catch(e){
            reject(e)
        }
    })()
  })
}

function transform(person) {

  if (person) {
    person = identify.whoIsPublic(person)
  }

  // splice hastags from post captions and set unique as hashtags
  if (person.posts) {

    // hashtags
    _.each(person.posts, item => {
      item.hashtags = item.captionText ? _.uniq(item.captionText.split(' ').filter(v => v.startsWith('#'))) : ''
      if (item.comments) {
        _.each(_.filter(item.comments, a => a.owner.username === item.ownerUsername), comment => {
            var comment_hashtags = comment.text ? _.uniq(comment.text.split(' ').filter(v => v.startsWith('#'))) : ''
            if (comment_hashtags) {
                _.each(comment_hashtags, hashtag => {
                    if (item.hashtags) {
                        item.hashtags.push(hashtag.trim())
                    }
                })
            }
        })
      }
      item.hashtags = _.uniq(item.hashtags)
    })

    _.each(person.posts, item => {
      item.links = item.captionText ? item.captionText.match(/\bhttps?::\/\/\S+/gi) : []
      item.links = _.uniq(item.links)
    })

    person.links = _.uniq(_.flatten(person.posts.map(a => a.links)))

    person.hashtags = _.uniq(_.flatten(person.posts.map(a => a.hashtags)))

    // mentions
    _.each(person.posts, item => {
      item.mentions = item.captionText ? _.uniq(item.captionText.split(' ').filter(v => v.startsWith('@'))) : ''
    })

    // person.mentions = _.uniq(_.flatten(person.posts.map(a => a.mentions)))

  }

  return person
  
}

module.exports = {
    profile(username, limit) {
        return new Promise((resolve, reject) => {
            scrape(username, limit).then((profile) => {
                resolve(transform(profile))
            }).catch(e => {
              reject(e)
            })
        })
    }
}