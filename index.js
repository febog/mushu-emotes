require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

// Paths for storing results
const EMOTE_LIST_PATH = "docs/_data/emotes.json";
const STATS_PATH = "docs/_data/stats.json";
const ARCHIVE_PATH = "docs/_data/archive.json";

// The code loads emotes from 3 different extension emote providers.
// Get the channel emotes URLs from environment variables for all providers.
const FFZ_CHANNEL_EMOTES_URL = process.env.FFZ_CHANNEL_EMOTES_URL;
const BTTV_CHANNEL_EMOTES_URL = process.env.BTTV_CHANNEL_EMOTES_URL;
const SEVENTV_CHANNEL_EMOTES_URL = process.env.SEVENTV_CHANNEL_EMOTES_URL;
const FFZ_SET_ID = process.env.FFZ_SET_ID;

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
  const emoteList = [];

  // Get FFZ channel emotes
  const ffzResponse = await axios.get(FFZ_CHANNEL_EMOTES_URL);
  ffzResponse.data.sets[FFZ_SET_ID].emoticons.map((e) => emoteList.push(getFfzEmote(e)));

  // Get BTTV channel and shared emotes, undocumented API.
  const bttvChannelResponse = await axios.get(BTTV_CHANNEL_EMOTES_URL);
  bttvChannelResponse.data.channelEmotes.map((e) => emoteList.push(getBttvEmote(e)));
  bttvChannelResponse.data.sharedEmotes.map((e) => emoteList.push(getBttvEmote(e)));

  // Get 7TV channel emotes
  const seventvResponse = await axios.get(SEVENTV_CHANNEL_EMOTES_URL);
  seventvResponse.data.emote_set.emotes.map((e) => emoteList.push(getSeventvEmote(e)));

  // Count emotes
  const ffzCount = ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.length;
  const bttvCount =
    bttvChannelResponse.data.channelEmotes.length +
    bttvChannelResponse.data.sharedEmotes.length;
  const seventvCount = seventvResponse.data.emote_set.emotes.length;
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
  let emoteArchive = [];
  fs.readFile(ARCHIVE_PATH, "utf8", function (err, data) {
    if (err) throw err;
    emoteArchive = JSON.parse(data);
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
 * @param {*} bttvType {BTTV Channel, BTTV Shared}
 */
function getBttvEmote(e) {
  let bttvEmoteUrl = `https://cdn.betterttv.net/emote/${e.id}/3x`;
  let bttvEmotePage = `https://betterttv.com/emotes/${e.id}`;
  let emote = new Emote(e.code, e.id, bttvEmoteUrl, bttvEmotePage, "BTTV");
  return emote;
}

/**
 * Parse FFZ response and return an emote
 * @param {*} e Emote object from FFZ response
 */
function getFfzEmote(e) {
  // "4" URL is the highest resolution image, if not available, use "1"
  let ffzEmoteUrl = `${e.urls["4"] || e.urls["1"]}`;
  let ffzEmotePage = `https://www.frankerfacez.com/emoticon/${e.id}-${e.name}`;
  let emote = new Emote(e.name, e.id, ffzEmoteUrl, ffzEmotePage, "FFZ");
  return emote;
}

/**
 * Parse 7TV response and return an emote
 * @param {*} e Emote object from 7TV response
 */
function getSeventvEmote(e) {
  // Fourth URL is the highest resolution image, if not available, use first
  let seventvEmoteUrl = `https:${e.data.host.url}/4x.webp`;
  let seventvEmotePage = `https://7tv.app/emotes/${e.id}`;
  let emote = new Emote(e.name, e.id, seventvEmoteUrl, seventvEmotePage, "7TV");
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
