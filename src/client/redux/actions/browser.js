/* import Config from 'configEnv'; */

import 'whatwg-fetch';
import geolib from 'geolib';
import axios from 'axios';

export const SEARCH_START = 'SEARCH_START';
export const SEARCH_ERROR = 'SEARCH_ERROR';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const FEATURE_START = 'FEATURE_START';
export const FEATURE_ERROR = 'FEATURE_ERROR';
export const FEATURE_SUCCESS = 'FEATURE_SUCCESS';
export const ORDER_SEARCH = 'ORDER_SEARCH';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/* this functions are unused, uncomment when needs */
/*
function searchStart(payload) {
  return {
    type: SEARCH_START,
  };
}
*//*
function searchError(payload) {
  return {
    type: SEARCH_ERROR,
    message: payload,
  };
}
*//*
function searchSuccess(raw, filtered) {
  return {
    type: SEARCH_SUCCESS,
    dataItems: raw,
    items: filtered,
  };
}

*/

function getFeaturesStart() {
  return {
    type: FEATURE_START,
  };
}

function getFeaturesError(payload) {
  return {
    type: FEATURE_ERROR,
    message: payload,
  };
}

function getFeaturesSuccess(payload) {
  return {
    type: FEATURE_SUCCESS,
    items: payload.data,
  };
}

/* function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
} */

function clusterItems(items) {
  const hasVideo = [];
  const hasPhoto = [];
  const hasOnlyText = [];
  const hasAudio = [];

  items.map((item) => {
    const media = JSON.parse(item.description).media.mediaVault;
    if (media.length > 0) {
      media.map((mediaItem) => {
        switch (mediaItem.mediaType) {
          case 'img':
            return hasPhoto.push(item);
          case 'vid':
            return hasVideo.push(item);
          case 'aud':
            return hasAudio.push(item);
          default:
            return hasOnlyText.push(item);
        }
      });
    }
    return hasOnlyText.push(item);
  });

  return {
    SHOW_ALL: items,
    SHOW_VIDEOS: hasVideo,
    SHOW_PHOTOS: hasPhoto,
    SHOW_TEXT: hasOnlyText,
    SHOW_MAP: items,
  };
}

export function setVisibilityFilter(filter) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_VISIBILITY_FILTER,
      items: clusterItems(getState().sorter.list)[filter],
      filter,
    });
  };
}

export function setOrder(order) {
  return (dispatch, getState) => {
    const items = Object.assign([], getState().browser.items);
    if (order === 'geolocation') {
      const locations = [];
      const coords = { latitude: '', longitude: '' };

      items.map((value) => {
        const newGeoArr = value.geolocation.split(',');
        const coordsObj = Object.assign({}, coords);
        if (newGeoArr.length < 2 || newGeoArr === '') {
          console.error(
            'One of these items do not have geolocation and therefore geolocation will not work',
          );
          coordsObj.latitude = 0;
          coordsObj.longitude = 0;
          return locations.push(coordsObj);
        }
        coordsObj.latitude = newGeoArr[0];
        coordsObj.longitude = newGeoArr[1];
        return locations.push(coordsObj);
      },
    );

      const newLocations = locations.reduce((acc, cur, i) => ({ ...acc, [i]: cur }), {});

      const currentLocation = {};

      fetch('http://ip-api.com/json').then(res => res.json()).then((data) => {
        currentLocation.latitude = data.lat;
        currentLocation.longitude = data.lon;
        const distance = geolib.orderByDistance(currentLocation, newLocations);

        distance.forEach((distanceValue) => {
          if (items[distanceValue.key].geolocation.length < 1) {
            items[distanceValue.key].distanceFromUser = undefined;
          }
          items[distanceValue.key].distanceFromUser = distanceValue.distance / 1609.34;
        });

        items.sort(
          (a, b) =>
            (a.distanceFromUser === undefined) - (b.distanceFromUser === undefined) ||
            a.distanceFromUser - b.distanceFromUser,
        );

        dispatch({
          type: ORDER_SEARCH,
          items,
        });
      });
    }

    items.sort((a, b) => {
      if (String(a[order]).toUpperCase() < String(b[order]).toUpperCase()) return -1;
      if (String(a[order]).toUpperCase() > String(b[order]).toUpperCase()) return 1;
      return 0;
    });
    dispatch({
      type: ORDER_SEARCH,
      items,
    });
  };
}

/**
 * Get featured items for carousel
 */
export function getFeatures() {
  return (dispatch) => { // return (dispatch, getState)
    dispatch(getFeaturesStart());

    axios
      .get('https://d3ocj7sd2go46j.cloudfront.net/API/featured')
      .then(response => dispatch(getFeaturesSuccess(response.data)))
      .catch(error => dispatch(getFeaturesError(error)));
  };
}

/**
 * Get offer items from syscoin offerfilter API
 */
export function search(data) {
  const data2search = data.regexp;
  // const getURL = data2search ? `/API/offers/search/${data2search}` : '/API/offers';
  const getURL = `/API/offers/search/${data2search}`;
  return (dispatch) => {
    axios
      .get(getURL)
      .then((response) => {
        // const items = data2search ? response.data.result : response.data;
        const items = response.data.result;
        dispatch({ type: ORDER_SEARCH, items });
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
