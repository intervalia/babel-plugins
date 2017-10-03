module.exports = function(babel) {
  var t = babel.types;
  //console.log(t);
  return {
    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;

        var node = path.node;

        var ref = node.declaration.id || path.scope.generateUidIdentifier("class");
        node.declaration.id = ref;

        path.replaceWith(node.declaration);
        path.insertAfter(t.exportDefaultDeclaration(ref));
      },
      ClassDeclaration: function(path) {
        var node = path.node;
        if (node.superClass && node.superClass.name !== 'HTMLElement') return;


        //console.log('------------------------------');
        //console.log('ClassDeclaration', path);
        //console.log('==============================');

        //node.superClass = null;
      },
      ClassExpression: function(path, state) {
        var node = path.node;
        var Constructor;

        if (node.superClass && node.superClass.name !== 'HTMLElement') return;

        //console.log('------------------------------');
        //console.log('ClassExpression', path);
        //console.log('==============================');

        /*
        if (node[VISITED]) return;

        var inferred = (0, _babelHelperFunctionName2.default)(path);
        if (inferred && inferred !== node) return path.replaceWith(inferred);

        node[VISITED] = true;

        Constructor = (state.opts.loose) ? _loose2.default : _vanilla2.default;

        path.replaceWith(new Constructor(path, state.file).run());
        */
      },
      ClassMethod: function(path, state) {
        var node = path.node;
        var Constructor;

        console.log('------------------------------');
        console.log('ClassMethod', path);
        console.log('==============================');

        /*
        if (node[VISITED]) return;

        var inferred = (0, _babelHelperFunctionName2.default)(path);
        if (inferred && inferred !== node) return path.replaceWith(inferred);

        node[VISITED] = true;

        Constructor = (state.opts.loose) ? _loose2.default : _vanilla2.default;

        path.replaceWith(new Constructor(path, state.file).run());
        */
      }
    }
  };
};
