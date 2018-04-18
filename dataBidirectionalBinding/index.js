/**
 * 初始化构造函数
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function myVue(options) {
  this._init(options);
}

/**
 * 初始化方法
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
myVue.prototype._init = function (options) {
  // 将数据传入对象体
  this.$options = options;
  this.$el = document.querySelector(options.el);
  this.$data = options.data;
  this.$methods = options.methods;
  // _binding保存着model和view的映射关系
  // 当model改变的时候，触发期中的指令类更新，保证view也能实时更新
  this._binding = {};
  // 观察data对象的变化
  this._obverse(this.$data);
  // 编译指令，绑定view和model
  this._complie(this.$el);
}

/**
 * 观察者，对data处理，重写data的set和get函数
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
myVue.prototype._obverse = function (obj) {
  var value;
  // 遍历obj对象
  for (key in obj) {
    // 判断对象中是否含有自身属性
    if (obj.hasOwnProperty(key)) {
      // 绑定前面的数据
      this._binding[key] = {
        _directives: []
      }
      value = obj[key]
      // 如果值是对象，则继续遍历
      if (typeof value === 'object') {
        this._obverse(value);
      }
      // 绑定前面的数据
      var binding = this._binding[key];
      // 重写set和get方法
      Object.defineProperty(this.$data, key, {
        enumerabble: true,  // 是否能在for...in循环中遍历出来或在Object.keys中列举出来
        configurable: true, // 总开关，一旦为false，就不能再设置他的（value，writable，configurable）
        get: function () {
          return value;
        },
        set: function (newVal) {
          if (value !== newVal) {
            value = newVal;
            // 当data中的值改变的时候，触发_binding[number]._directives 中绑定的Watcher类更新
            binding._directives.forEach(function (item) {
              item.update()
            })
          }
        }
      })
    }
  }
}

/**
 * 绑定view和model，解析指令
 * @param  {[type]} root [description]
 * @return {[type]}      [description]
 */
myVue.prototype._complie = function (root) {
  var _this = this;
  var nodes = root.children;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    // 遍历并编译所有的元素
    if (node.children.length) {
      this._complie(node);
    }
    // 判断元素是否'v-click'属性，并且将它作为一个指令，监听它的onclick事件
    if (node.hasAttribute('v-click')) {
      node.onclick = (function () {
        var attrVal = nodes[i].getAttribute('v-click');
        // bind是使用data的作用域与method函数的作用域保持一致
        return _this.$methods[attrVal].bind(_this.$data);
      })();
    }
    // 设置v-model指令监听它的input事件，并且该指令只对input或textarea元素生效
    if (node.hasAttribute('v-model') && (node.tagName == 'INPUT' || node.tagName == 'TEXTAREA')) {
      // 给元素添加input事件，监听值的变化
      node.addEventListener('input', (function (key) {
        var attrVal = node.getAttribute('v-model');
        _this._binding[attrVal]._directives.push(new Watcher(
          'input',
          node,
          _this,
          attrVal,
          'value'
        ))
        return function () {
          _this.$data[attrVal] = nodes[key].value;
        }
      })(i));
    }
    // 设置v-bind指令，将node的值更新为data中的值
    if (node.hasAttribute('v-bind')) {
      var attrVal = node.getAttribute('v-bind');
      _this._binding[attrVal]._directives.push(new Watcher(
        'text',
        node,
        _this,
        attrVal,
        'innerHTML'
      ))
    }
  }
}

/**
 * 指令类，用于绑定更新函数，实现对DOM元素的更新
 * @param {[type]} name 指令名称
 * @param {[type]} el   指令对应的DOM元素
 * @param {[type]} vm   指令所属myVue实例
 * @param {[type]} exp  指令对应的值
 * @param {[type]} attr 绑定的属性值
 */
function Watcher(name, el, vm, exp, attr) {
  this.name = name;
  this.el = el;
  this.vm = vm;
  this.exp = exp;
  this.attr = attr;
  this.update();
}

/**
 * 更新方法
 * @return {[type]} [description]
 */
Watcher.prototype.update = function () {
  // 当指令中的值改变的时候，触发update函数，保证对应的DOM内容进行更新
  this.el[this.attr] = this.vm.$data[this.exp];
}
