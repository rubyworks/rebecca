// rdoc convertor
var rundown = new Rundown.converter();  /* TODO: support other formats */

// @todo handle format
Handlebars.registerHelper('markup', function(text, format) {
  var ret = rundown.makeHtml(text);
  return new Handlebars.SafeString(ret);
});

//
Handlebars.registerHelper('calc_id', function(path) {
  Rebecca.id(path);
});

//
Handlebars.registerHelper('calc_href', function(id) {
  Rebecca.href(id);
});

// @todo Combine with above.
Handlebars.registerHelper('calc_href_method', function() {
  Rebecca.method_href(this);
});

//
Handlebars.registerHelper('if_class', function(options) {
  if this['!'] == 'class'
    return options.fn(this);
  } else {
    return '';
  };
});

//
Handlebars.registerHelper('unless_header', function(options) {
  if (! /^\s*[=#]/.test(this.comment)) {
    return options.fn(this);
  } else {
    return '';
  };
});

//
Handlebars.registerHelper('if_namespaces', function(options) {
 if (this.classes.length > 0 || this.modules.length > 0) {
   return options.fn(this);
 } else {
   return '';
 };
});

//
Handlebars.registerHelper('doc', function(options) {
  var doc = Rebecca.documentation_by_key[this];
  if (doc != null) {
    return options.fn(doc);
  } else {
    return '';
  };
});

//
Handlebars.registerHelper('letters', function(block) {
  var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var ret = "";

  for (i=0;i<=25;i++) {
    sub = {letter: '' + abc[i]};
    ret = ret + block(sub);
  };

  return(ret);
});

// Register `detail` partial.
Handlebars.registerPartial("file_stats", Handlebars.templates.file_stats);

