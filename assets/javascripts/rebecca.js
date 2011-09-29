// Rebecca's Javascript

Rebecca = {

  version: '1',

  // Developer mode.
  debug: true,

  //
  current_menu: null,

  //
  documentation: {
    'all'    :   new Array(),
    'methods':   new Array(),
    'modules':   new Array(),
    'scripts':   new Array(),
    'documents': new Array()
  },

  //
  documentation_by_key: {},

  //
  documentation_by_id: {},

  //
  metadata: {},

  //
  bootup: function() {
    var urlVars = Rebecca.getUrlVars();
    var url     = urlVars['doc'] || 'doc.json';

    $.getJSON(url, function(data) {
      // set up documentation
      $.each(data, function(key, doc) {
        doc.key = key;

        if (doc.path != undefined) {
          doc.id = Rebecca.id('api-' + doc['!'] + '-' + doc.path);
        } else {
          doc.id = 'metadata'
        }

        Rebecca.documentation_by_key[doc.key] = doc;
        Rebecca.documentation_by_id[doc.id]   = doc;

        Rebecca.documentation['all'].push(doc);

        switch(doc['!']) {
        case 'method':
          Rebecca.documentation['methods'].push(doc);
          break;
        case 'class':
          Rebecca.documentation['modules'].push(doc);
          break;
        case 'module':
          Rebecca.documentation['modules'].push(doc);
          break;
        case 'document':
          Rebecca.documentation['documents'].push(doc);
          break;
        case 'script':
          Rebecca.documentation['scripts'].push(doc);
          break;
        };
      });

      Rebecca.metadata = data['(metadata)'];

      Rebecca.documentation['all'].sort(Rebecca.compareNames);

      //$('#title').append($('#template-title').jqote(Rebecca.metadata));
      //$('#dropdown').append($('#template-dropdown').jqote());

      $("#template-title").tmpl(Rebecca.metadata).appendTo("#title");
      $('#template-nav').tmpl({}).appendTo('#nav');

      // CENTRAL CONTROL
      $.history.init(function(hash){
        if(hash == "") {          // TODO: use main setting how?
          var readme = Rebecca.metadata['readme'];
          if (readme == undefined) {
            for(i in Rebecca.documentation['documents']) {
              d = Rebecca.documentation['documents'][i];
              if (d.name.match(/^README/i)) {
                readme = d; break;
              }
            }
          };
          Rebecca.show(readme.id);
        } else {
          Rebecca.show(hash);   // restore the state from hash
        }
      });

      hookHighlightSyntax();
      hookSourceViews();
      hookDebuggingToggle();
      hookQuickSearch();
      highlightLocationTarget();

      $('ul.link-list a').bind("click", highlightClickTarget);

    });
  },

  //
  id: function(key) {
    // key = encodeURIComponent(key);  DID NOT WORK
    key = key.replace(/\</g,  "-l-");
    key = key.replace(/\>/g,  "-g-");
    key = key.replace(/\=/g,  "-e-");
    key = key.replace(/\?/g,  "-q-");
    key = key.replace(/\!/g,  "-x-");
    key = key.replace(/\~/g,  "-t-");
    key = key.replace(/\[/g,  "-b-");
    key = key.replace(/\]/g,  "-k-");
    key = key.replace(/\#/g,  "-h-");
    key = key.replace(/\./g,  "-d-");
    key = key.replace(/\:\:/g,"-C-");
    key = key.replace(/\:/g,  "-c-");
    key = key.replace(/[/]/g, "-s-");
    key = key.replace(/\W+/g, "-");  // TOO GENERAL?
    key = key.replace(/\W+/g, "-");  // For GOOD MEASURE
    return(key);
  },

  //
  compareNames: function(a, b){
    if (a.name < b.name) {return -1}
    if (a.name > b.name) {return 1}
    return 0;
  },

  //
  getUrlVars: function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },

  show: function(id) {
    var doc = Rebecca.documentation_by_id[id];

    console.debug(id);
    console.debug(doc);

    if (doc != null) {
      var type = doc['!'];
      if(type == 'class'){ type = 'module' };
      $('#content').empty().append($('#template-' + type).tmpl(doc));
      $('#search-section').hide();
      $('#content').find('pre code').each(function(i, e){hljs.highlightBlock(e, '  ')});
    } else {
      $('#content').empty().append('Not Found.');
    };
  },

  //
  divy_methods: function(methods) {
    var s = 'instance';
    var v = 'public';
    var list = {
      'class':    {'public': new Array(), 'protected': new Array(), 'private': new Array()},
      'instance': {'public': new Array(), 'protected': new Array(), 'private': new Array()}
    }
    $.each(methods, function(i, x) {
      var doc = Rebecca.documentation_by_key[x];
      if (doc.declarations.contains('class')) {
        s = 'class'
      } else {
        s = 'instance'
      }
      if (doc.declarations.contains('private')) {
        v = 'private';
      } else if (doc.declarations.contains('protected')) {
        v = 'protected';
      } else {
        v = 'public';
      }
      list[s][v].push(doc);
    });
    return(list);
  },

  // Used to convert RDoc document to HTML.
  // TODO: support other formats besides RDoc Simple Markup ?
  markup: function(text,format) {
    convertor = new Rundown.converter();
    return(convertor.makeHtml(text));
  },

  //
  
  // Show and hide navigation dropdown menus.
  menuToggle: function(menuId,navClass) {
    if (navClass == null) { navClass='.nav' };
    if(  $(menuId).is(":visible") == true ){
      $(menuId).hide();
    }
    else{
      // $(navClass).hide();
      $(menuId).show();
    }
  },

  //function menuOn(menuId){
  //  if (navClass == null) { navClass='.nav' };
  //  $(menuId).show();
  //};

  //
  menuOn: function(menuId,navClass){
    if (navClass == null) { navClass='.nav' };
    $(navClass).hide();
    $(menuId).show();
  },

  //
  menuOff: function(menuId,navClass){
    if (navClass == null) { navClass='.nav' };
    if(  $(menuId).is(":visible") == true ){
      $(navClass).hide();
    }
  },

}

/*
String.prototype.escapeHTML = function () {
  return(                                                                 
    this.replace(/\&/g,'&amp;').                                
         replace(/\>/g,'&gt;').
         replace(/\</g,'&lt;').
         replace(/\"/g,'&quot;')
  );                                          
};
*/

//
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

