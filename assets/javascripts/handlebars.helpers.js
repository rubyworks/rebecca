// rdoc convertor
var rundown = new Rundown.converter();  /* TODO: support other formats */

//
// @todo handle format
//
Handlebars.registerHelper('markup', function(text, format) {
  var ret = rundown.makeHtml(text);
  return new Handlebars.SafeString(ret);
});


//
// Calcuate the documentation `id` given a `path`.
//
Handlebars.registerHelper('calc_id', function(path) {
  return Rebecca.id(path);
});


//
// Calculate the internal href given the documentaiton `id`.
//
Handlebars.registerHelper('calc_href', function(id) {
  return Rebecca.href(id);
});

//
// @todo Combine with above.
//
Handlebars.registerHelper('calc_method_href', function() {
 return Rebecca.method_href(this);
});

//
// If they the of documentation object is a `class`, then 
// render the given block.
//
Handlebars.registerHelper('if_class', function(options) {
  if (this['!'] == 'class') {
    return options.fn(this);
  } else {
    return '';
  };
});

//
// If the `comment` starts with a header, as indicated by a `=` or `#`,
// then do not render the given block.
//
Handlebars.registerHelper('unless_header', function(options) {
  if (! /^\s*[=#]/.test(this.comment)) {
    return options.fn(this);
  } else {
    return '';
  };
});

//
// This helper ensures there is a least one class or module for the
// given block to be rendered.
//
Handlebars.registerHelper('if_namespaces', function(options) {
 if (this.classes.length > 0 || this.modules.length > 0) {
   return options.fn(this);
 } else {
   return '';
 };
});

//
// Iterate over each `list` entry, looking the item up in documentation,
// and rendering the given block with it.
//
Handlebars.registerHelper('doc', function(list, options) {
  var doc;
  var out = '';

  for(var i=0, l=list.length; i<l; i++) {
    doc = Rebecca.documentation_by_key[list[i]];
    if (doc != null) {
      out = out + options.fn(doc);
    };
  };

  return out;
});

//
// For use in the context of `#doc accessors`, this renders the block for a reader.
//
Handlebars.registerHelper('reader', function(options) {
  var doc = Rebecca.documentation_by_key[this];
  var out = '';
  if (doc != null) {
    out = options.fn(doc);
  };
  return out;
});

//
// For use in the context of `#doc accessors`, this renders the block for a writer.
//
Handlebars.registerHelper('writer', function(options) {
  var doc = Rebecca.documentation_by_key[this+'='];
  var out = '';
  if (doc != null) {
    out = options.fn(doc);
  };
  return out;
});

//
// This helper divides methods up by class/instance scope and public/private/protected
// visibility and then renders the given block with this.
//
Handlebars.registerHelper('methods_categorized', function(block) {
  var meths = Rebecca.divy_methods(this.methods);
  var out = '';

  if (this.methods.length > 0) {
    out = block(meths);
  };

  return out;
});

//
// This helper makes sure there are methods with a given scope and visibility.
// If so it renders the given block with the current context.
// It is intended to be used in the context of `methods_categorized`.
//
Handlebars.registerHelper('if_methods_by', function(scope, visibility, options) {
  var out = '';

  if (this[scope][visibility].length > 0) {
    out = options.fn(this);
  };

  return out;
});

//
// This helper iterates over methods with a given scope and visibility.
// It is intended to be used in the context of `methods_categorized`.
//
Handlebars.registerHelper('methods_by', function(scope, visibility, options) {
  var meths = this[scope][visibility];
  var out = '';

  for(var i=0, l=meths.length; i<l; i++) {
    out = out + options.fn(meths[i]);
  };

  return out;
});

//
// List of alphabet.
//
// @deprecated Not used.
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


// Register `method` partial.
Handlebars.registerPartial("method", Handlebars.templates.method);

// Register `file_stats` partial.
Handlebars.registerPartial("file_stats", Handlebars.templates.file_stats);

