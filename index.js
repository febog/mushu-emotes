require("dotenv").config();
const fs = require("fs");

// Paths for storing results
const EMOTE_LIST_PATH = "docs/_data/emotes.json";
const STATS_PATH = "docs/_data/stats.json";
const ARCHIVE_PATH = "docs/_data/archive.json";

// The code loads emotes from 3 different extension emote providers.
// Get the channel emotes URLs from environment variables for all providers.
const userId = process.env.TWITCH_USER_ID_MUSHU;
// FFZ (https://www.frankerfacez.com/)
// API Documentation: https://api.frankerfacez.com/docs/#/Rooms/get_v1_room_id__twitchID_
const FFZ_CHANNEL_EMOTES_URL = "https://api.frankerfacez.com/v1/room/id/" + userId;
// BTTV (https://betterttv.com/)
// API Documentation: https://betterttv.com/developers/api#user
const BTTV_CHANNEL_EMOTES_URL = "https://api.betterttv.net/3/cached/users/twitch/" + userId;
// 7TV (https://7tv.app/)
// API Documentation: https://7tv.io/docs ("Get User Connection")
const SEVENTV_CHANNEL_EMOTES_URL = "https://7tv.io/v3/users/twitch/" + userId;

class Emote {
  /**
   * For every emote, we collect the following data:
   * @param {string} name Emote code (the emote name)
   * @param {string} id Internal ID (provider's emote ID)
   * @param {string} img_url Image URL for thumbnail
   * @param {string} page_url Provider's emote page
   * @param {string} type {FFZ, BTTV, 7TV}
   */
  constructor(name, id, img_url, page_url, type) {
    this.name = name;
    this.id = id;
    this.img_url = img_url;
    this.page_url = page_url;
    this.type = type;
  }
}

class Count {
  constructor(ffzCount, bttvCount, seventvCount, totalCount) {
    this.ffzCount = ffzCount;
    this.bttvCount = bttvCount;
    this.seventvCount = seventvCount;
    this.totalCount = totalCount;
  }
}

async function updateEmoteList() {
  // Array of Emote objects
  const emoteList = [];

  // Get FFZ channel emotes
  const ffzResponse = await fetch(FFZ_CHANNEL_EMOTES_URL);
  // The list of emotes exists under "sets" under the property indicated by the set ID.
  const ffzData = await ffzResponse.json();
  const FFZ_SET_ID = ffzData.room.set;
  ffzData.sets[FFZ_SET_ID].emoticons.map((e) => emoteList.push(parseFfzEmote(e)));

  // Get BTTV channel and shared emotes
  const bttvChannelResponse = await fetch(BTTV_CHANNEL_EMOTES_URL);
  const bttvChannelData = await bttvChannelResponse.json();
  bttvChannelData.channelEmotes.map((e) => emoteList.push(parseBttvEmote(e)));
  bttvChannelData.sharedEmotes.map((e) => emoteList.push(parseBttvEmote(e)));

  // Get 7TV channel emotes
  const seventvResponse = await fetch(SEVENTV_CHANNEL_EMOTES_URL);
  const seventvData = await seventvResponse.json();
  seventvData.emote_set.emotes.map((e) => emoteList.push(parseSeventvEmote(e)));

  // Count emotes
  const ffzCount = ffzData.sets[FFZ_SET_ID].emoticons.length;
  const bttvCount = bttvChannelData.channelEmotes.length + bttvChannelData.sharedEmotes.length;
  const seventvCount = seventvData.emote_set.emotes.length;
  const count = new Count(
    ffzCount,
    bttvCount,
    seventvCount,
    ffzCount + bttvCount + seventvCount
  );
  console.log("Number of emotes loaded:", emoteList.length);

  emoteList.sort(emoteSort);

  // Search for duplicates
  let previousEmote = "";
  emoteList.forEach((emote) => {
    if (previousEmote === emote.name) {
      console.log("Duplicate found:", emote.name);
    }
    previousEmote = emote.name;
  });

  // Archive emotes if they don't exist yet in the emote archive
  fs.readFile(ARCHIVE_PATH, "utf8", function (err, data) {
    if (err) throw err;
    const emoteArchive = JSON.parse(data);
    emoteList.forEach((emote) => {
      if (emoteArchive.findIndex((archive) => archive.id === emote.id) === -1) {
        emoteArchive.push(emote);
      }
    });
    emoteArchive.sort(emoteSort);
    fs.writeFile(
      ARCHIVE_PATH,
      JSON.stringify(emoteArchive, null, 2),
      (error) => {
        if (error) throw err;
      }
    );
  });

  // Format results as a JSON string and write to a file
  fs.writeFile(EMOTE_LIST_PATH, JSON.stringify(emoteList, null, 2), (error) => {
    if (error) throw err;
  });
  fs.writeFile(STATS_PATH, JSON.stringify(count, null, 2), (error) => {
    if (error) throw err;
  });
}

updateEmoteList();

/**
 * Parse BTTV response and return an emote
 * @param {*} e Emote object from BTTV response
 */
function parseBttvEmote(e) {
  const bttvEmoteUrl = `https://cdn.betterttv.net/emote/${e.id}/1x`;
  const bttvEmotePage = `https://betterttv.com/emotes/${e.id}`;
  const emote = new Emote(e.code, e.id, bttvEmoteUrl, bttvEmotePage, "BTTV");
  return emote;
}

/**
 * Parse FFZ response and return an emote
 * @param {*} e Emote object from FFZ response
 */
function parseFfzEmote(e) {
  // "4" URL is the highest resolution image, using the smallest "1" by default
  const ffzEmoteUrl = `${e.urls["1"]}`;
  const ffzEmotePage = `https://www.frankerfacez.com/emoticon/${e.id}-${e.name}`;
  const emote = new Emote(e.name, e.id, ffzEmoteUrl, ffzEmotePage, "FFZ");
  return emote;
}

/**
 * Parse 7TV response and return an emote
 * @param {*} e Emote object from 7TV response
 */
function parseSeventvEmote(e) {
  const seventvEmoteUrl = `https:${e.data.host.url}/1x.webp`;
  const seventvEmotePage = `https://7tv.app/emotes/${e.id}`;
  const emote = new Emote(e.name, e.id, seventvEmoteUrl, seventvEmotePage, "7TV");
  return emote;
}

/**
 * Sort emote by name (case-insensitive) and then by Id. To be passed to sort().
 * @param {Object} a First emote
 * @param {Object} b Second emote
 */
function emoteSort(a, b) {
  // Case insenstive
  const nameComparison = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

  // If same name, use ID
  if (nameComparison === 0) {
    return a.id.toString() > b.id.toString() ? 1 : -1;
  }
  return nameComparison
}
