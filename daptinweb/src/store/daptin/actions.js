import {DaptinClient} from 'daptin-client';

// const daptinClient = new DaptinClient(window.location.protocol + "//" + window.location.hostname, false, function () {
var daptinClient = new DaptinClient("http://localhost:6336", false, {
  getToken: function () {
    return localStorage.getItem("token");
  }
});
daptinClient.worldManager.init();


export function load({commit}) {
  console.log("Load tables");
  daptinClient.worldManager.loadModels().then(function (worlds) {
    console.log("All models loaded", arguments);
    commit('setTables', worlds)
  }).catch(function (e) {
    console.log("Failed to connect to backend", e);
  })
}

export function setToken({commit}) {
  let token = localStorage.getItem("token");
  if (!token) {
    throw "Failed to login";
  }
  commit('setToken', token)
}

export function executeAction({commit}, params) {
  var tableName = params.tableName;
  var actionName = params.actionName;
  return daptinClient.actionManager.doAction(tableName, actionName, params.params);
}

export function getTableSchema({commit}, tableName) {
  return new Promise(function (resolve, reject) {
    resolve(daptinClient.worldManager.getColumnKeys(tableName));
  })
}

export function loadModel({commit}, tableName) {
  return daptinClient.worldManager.loadModel(tableName);
}

export function refreshTableSchema({commit}, tableName) {
  daptinClient.worldManager.refreshWorld(tableName).then(function (e) {
    console.log("Refresh table schema", tableName, e);
    commit('setTables', e)
  });
}