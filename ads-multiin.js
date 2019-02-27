module.exports = function (RED) {
  'use strict'
  var util = require('util')
  var debug = require('debug')('node-red-contrib-ads:adsMultiInNode')

  function adsMultiInNode(config) {
    RED.nodes.createNode(this, config)
    var node = this

    node.adsDatasource = RED.nodes.getNode(config.datasource)
    if (node.adsDatasource) {
      debug('config:',config)

      //node.onAdsData = function (handle){
      //  debug('onAdsData:','node.id',node.id,'node.symname',node.symname,'handle.value',handle.value)
      //  var msg = {}
      //  RED.util.setMessageProperty(msg, node.inValue, handle.value)
      //  node.send(msg)
      //  debug('onAdsData:','node.id',node.id,'node.symname',node.symname,'msg',msg)
      //}

      this.on("input", function(msg) {
        debug('input:',msg)

        var cfg = [{
          symname: msg.config[0].varName,
          adstype: msg.config[0].varType,
          bytelength: msg.config[0].varSize,
          timezone: msg.config[0].timezone,
          inValue: (msg.config[0].inValue||'payload'),
          useInputMsg: (msg.config[0].useInputMsg||false),
          topic: (msg.config[0].topic||'')
         }, {
         symname: msg.config[1].varName,
          adstype: msg.config[1].varType,
          bytelength: msg.config[1].varSize,
          timezone: msg.config[1].timezone,
          inValue: (msg.config[1].inValue||'payload'),
          useInputMsg: (msg.config[1].useInputMsg||false),
          topic: (msg.config[1].topic||'')
         }]

        // cfg.hasTopic = cfg.topic.length > 0
        var outMsg = {}
        // if (cfg.useInputMsg) {
        //   outMsg = Object.assign({},msg)
        // }

        node.adsDatasource.multiread(node, cfg, function(handles) {
          RED.util.setMessageProperty(outMsg, cfg.inValue, handles)
          node.send(outMsg)
        })
      })

      node.on('close', function () {
      })
    }
  }
  RED.nodes.registerType('ADS MultiIn', adsMultiInNode)
}
