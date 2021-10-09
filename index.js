require("dotenv").config();
const axios = require("axios");

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
    // Constructor
    this.name = name;
    this.id = id;
    this.img_url = img_url;
    this.page_url = page_url;
    this.type = type;
  }
}

class Count {
  constructor(ffZCount, bttvCount, totalCount) {
    // Constructor
    this.ffZCount = ffZCount;
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
    emoteList.push(getBttvEmote(e, "BTTV Channel"))
  );
  bttvChannelResponse.data.sharedEmotes.map((e) =>
    emoteList.push(getBttvEmote(e, "BTTV Shared"))
  );

  // Count emotes
  let ffzCount = ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.length;
  let bttvCount =
    bttvChannelResponse.data.channelEmotes.length +
    bttvChannelResponse.data.sharedEmotes.length;
  let count = new Count(ffzCount, bttvCount, ffzCount + bttvCount);
  console.log(count);
  console.log("Number of emotes loaded: ", emoteList.length);
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
 * Parse BTTV response and return an emote
 * @param {*} e Emote object from FFZ response
 */
function getFfzEmote(e) {
  // "4" URL is the highest resolution image
  let ffzEmoteUrl = `https:${e.urls["4"]}`;
  let ffzEmotePage = `https://www.frankerfacez.com/emoticon/${e.id}-${e.name}`;
  let emote = new Emote(e.name, e.id, ffzEmoteUrl, ffzEmotePage, "FFZ");
  return emote;
}
