const fetch = require('node-fetch');

const MEETUP_API = 'https://api.meetup.com';

require('dotenv').config();

function getMeetup(link) {
  const result = link.match(/https:\/\/www\.meetup\.com\/(.*)\/events\/([0-9]*)(\/)?/);
  if (result) {
    const { 1: name, 2: id } = result;
    return fetch(`${MEETUP_API}/${name}/events/${id}?api_key=${process.env.MEETUP_API_KEY}`)
      .then(response => response.json())
      .then((event) => {
        const {
          name: title,
          description,
          time: date,
          time: start_time,
          duration,
          link: url,
          venue,
          group } = event;

        return {
          title,
          description,
          date,
          start_time,
          end_time: duration ? start_time + duration : undefined,
          url,
          address: `${venue.address_1}, ${venue.city}, ${venue.state}`,
          location_name: venue.name,
          meetup_name: group.name
        };
      });
  }
  return Promise.reject(new Error('Not a valid meetup URL'));
}

module.exports = {
  getMeetup
};
