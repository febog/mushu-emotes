require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

// Paths for storing results
const EMOTE_LIST_PATH = "docs/_data/emotes.json";
const STATS_PATH = "docs/_data/stats.json";
const ARCHIVE_PATH = "docs/_data/archive.json";

class Emote {
  /**
   * For every emote, we collect the following data:
   * @param {string} name Emote code
   * @param {string} id Internal ID
   * @param {string} img_url Image URL for thumbnail
   * @param {string} page_url BTTV or FFZ emote page
   * @param {string} type {FFZ, BTTV Channel, BTTV Shared}
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
  constructor(ffzCount, bttvCount, totalCount) {
    this.ffzCount = ffzCount;
    this.bttvCount = bttvCount;
    this.totalCount = totalCount;
  }
}

var emoteList = [];

async function updateEmoteList() {
  // Get FFZ channel emotes
  const ffzResponse = await axios.get(process.env.FFZ_CHANNEL_EMOTES_URL);
  ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.map((e) =>
    emoteList.push(getFfzEmote(e))
  );

  // Get BTTV channel and shared emotes, undocumented API.
  const bttvChannelResponse = await axios.get(
    process.env.BTTV_CHANNEL_EMOTES_URL
  );
  bttvChannelResponse.data.channelEmotes.map((e) =>
    emoteList.push(getBttvEmote(e, "BTTV"))
  );
  bttvChannelResponse.data.sharedEmotes.map((e) =>
    emoteList.push(getBttvEmote(e, "BTTV"))
  );

  // Count emotes
  let ffzCount = ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.length;
  let bttvCount =
    bttvChannelResponse.data.channelEmotes.length +
    bttvChannelResponse.data.sharedEmotes.length;
  let count = new Count(ffzCount, bttvCount, ffzCount + bttvCount);
  console.log("Number of emotes loaded:", emoteList.length);

  // Sort emotes by name
  emoteList.sort((a, b) => (a.name > b.name ? 1 : -1));

  // Find duplicates in currently enabled emotes by iterating them since they
  // are already sorted
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
    if (err) {
      return console.log(err);
    }
    emoteArchive = JSON.parse(data);
    emoteList.forEach((emote) => {
      if (emoteArchive.findIndex((archive) => archive.id === emote.id) === -1) {
        emoteArchive.push(emote);
        console.log("Adding to archive:", emote);
      }
    });
    // Sort emotes by name
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
function getBttvEmote(e, bttvType) {
  let bttvEmoteUrl = `https://cdn.betterttv.net/emote/${e.id}/3x`;
  let bttvEmotePage = `https://betterttv.com/emotes/${e.id}`;
  let emote = new Emote(e.code, e.id, bttvEmoteUrl, bttvEmotePage, bttvType);
  return emote;
}

/**
 * Parse FFZ response and return an emote
 * @param {*} e Emote object from FFZ response
 */
function getFfzEmote(e) {
  // "4" URL is the highest resolution image, if not available, use "1"
  let ffzEmoteUrl = `https:${e.urls["4"] || e.urls["1"]}`;
  let ffzEmotePage = `https://www.frankerfacez.com/emoticon/${e.id}-${e.name}`;
  let emote = new Emote(e.name, e.id, ffzEmoteUrl, ffzEmotePage, "FFZ");
  return emote;
}

/**
 * Sort emote by name and then by Id. To be passed to sort().
 * @param {Object} a First emote
 * @param {Object} b Second emote
 */
function emoteSort(a, b) {
  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return a.id.toString() > b.id.toString() ? 1 : -1;
}
