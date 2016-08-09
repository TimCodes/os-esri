// start with wrappign in an IIFE
//  then declare you angular code
(function(){
    'use strict';
    
    // define module here
    // module takes two arugments
    // first is the name of your module
    // second is an array of dependencies
    // good idea to prepent names with something
    // to avoid naming collesiosn with other libraries
    // hence the os
    angular.module('app', [
      'os-esri-components',
     
    ])
}())

(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("app")
    .component("controlContainer", buildComponent())

    function buildComponent() {
       
        return {

            templateUrl: 'controlcontiner.html',
            controller: controlContainerController,
            transclude: true,
            controllerAs: 'vm',
            bindings: {
                
               containerIsShown: '<',
               isDraggable: '<',
               containerTitle: '@',
               containerVisability: '&'    
            },
        

        }

        function controlContainerController($rootScope, $scope) {
            var vm = this;
            
            
            vm.showContainer = vm.containerIsShown;
            
            
            vm.turnOffCotinaer = function () {
               vm.showContainer = false
               vm.containerVisability({visible:vm.showContainer})
            };
            
            vm.$onChanges = function(changesObj){
                 vm.showContainer = vm.containerIsShown;
                 //changesObj.containerShowable.currentValue
            } 
            
        }
    }

}())
/**
 * @author RubaXa <trash@rubaxa.org>
 * @licence MIT
 */
 
function  factory () {
	'use strict';


	/**
	 * @typedef   {Object}        ngSortEvent
	 * @property  {*}             model      List item
	 * @property  {Object|Array}  models     List of items
	 * @property  {number}        oldIndex   before sort
	 * @property  {number}        newIndex   after sort
	 */
    var Sortable = sortable();
	var expando = 'Sortable:ng-sortable';
  
	angular.module('ng-sortable', [])
		.constant('ngSortableVersion', '0.4.0')
		.constant('ngSortableConfig', {})
		.directive('ngSortable', ['$parse', 'ngSortableConfig', function ($parse, ngSortableConfig) {
			var removed,
				nextSibling,
				getSourceFactory = function getSourceFactory(el, scope) {
					var ngRepeat = [].filter.call(el.childNodes, function (node) {
						return (
								(node.nodeType === 8) &&
								(node.nodeValue.indexOf('ngRepeat:') !== -1)
							);
					})[0];

					if (!ngRepeat) {
						// Without ng-repeat
						return function () {
							return null;
						};
					}

					// tests: http://jsbin.com/kosubutilo/1/edit?js,output
					ngRepeat = ngRepeat.nodeValue.match(/ngRepeat:\s*(?:\(.*?,\s*)?([^\s)]+)[\s)]+in\s+([^\s|]+)/);

					var itemsExpr = $parse(ngRepeat[2]);

					return function () {
						return itemsExpr(scope.$parent) || [];
					};
				};


			// Export
			return {
				restrict: 'AC',
				scope: { ngSortable: "=?" },
				link: function (scope, $el) {
					var el = $el[0],
						options = angular.extend(scope.ngSortable || {}, ngSortableConfig),
						watchers = [],
						getSource = getSourceFactory(el, scope),
						sortable
					;

					el[expando] = getSource;

					function _emitEvent(/**Event*/evt, /*Mixed*/item) {
						var name = 'on' + evt.type.charAt(0).toUpperCase() + evt.type.substr(1);
						var source = getSource();

						/* jshint expr:true */
						options[name] && options[name]({
							model: item || source[evt.newIndex],
							models: source,
							oldIndex: evt.oldIndex,
							newIndex: evt.newIndex
						});
					}


					function _sync(/**Event*/evt) {
						var items = getSource();

						if (!items) {
							// Without ng-repeat
							return;
						}

						var oldIndex = evt.oldIndex,
							newIndex = evt.newIndex;

						if (el !== evt.from) {
							var prevItems = evt.from[expando]();

							removed = prevItems[oldIndex];

							if (evt.clone) {
								removed = angular.copy(removed);
								prevItems.splice(Sortable.utils.index(evt.clone), 0, prevItems.splice(oldIndex, 1)[0]);
								evt.from.removeChild(evt.clone);
							}
							else {
								prevItems.splice(oldIndex, 1);
							}

							items.splice(newIndex, 0, removed);

							evt.from.insertBefore(evt.item, nextSibling); // revert element
						}
						else {
							items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
						}

						scope.$apply();
					}


					sortable = Sortable.create(el, Object.keys(options).reduce(function (opts, name) {
						opts[name] = opts[name] || options[name];
						return opts;
					}, {
						onStart: function (/**Event*/evt) {
							nextSibling = evt.item.nextSibling;
							_emitEvent(evt);
							scope.$apply();
						},
						onEnd: function (/**Event*/evt) {
							_emitEvent(evt, removed);
							scope.$apply();
						},
						onAdd: function (/**Event*/evt) {
							_sync(evt);
							_emitEvent(evt, removed);
							scope.$apply();
						},
						onUpdate: function (/**Event*/evt) {
							_sync(evt);
							_emitEvent(evt);
						},
						onRemove: function (/**Event*/evt) {
							_emitEvent(evt, removed);
						},
						onSort: function (/**Event*/evt) {
							_emitEvent(evt);
						}
					}));

					$el.on('$destroy', function () {
						angular.forEach(watchers, function (/** Function */unwatch) {
							unwatch();
						});

						sortable.destroy();

						el[expando] = null;
						el = null;
						watchers = null;
						sortable = null;
						nextSibling = null;
					});

					angular.forEach([
						'sort', 'disabled', 'draggable', 'handle', 'animation', 'group', 'ghostClass', 'filter',
						'onStart', 'onEnd', 'onAdd', 'onUpdate', 'onRemove', 'onSort'
					], function (name) {
						watchers.push(scope.$watch('ngSortable.' + name, function (value) {
							if (value !== void 0) {
								options[name] = value;

								if (!/^on[A-Z]/.test(name)) {
									sortable.option(name, value);
								}
							}
						}));
					});
				}
			};
		}]);
};


function sortable () {
	"use strict";

	var dragEl,
		parentEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,

		scrollEl,
		scrollParentEl,

		lastEl,
		lastCSS,
		lastParentCSS,

		oldIndex,
		newIndex,

		activeGroup,
		autoScroll = {},

		tapEvt,
		touchEvt,

		moved,

		/** @const */
		RSPACE = /\s+/g,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,

		supportDraggable = !!('draggable' in document.createElement('div')),
		supportCssPointerEvents = (function (el) {
			el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		slice = [].slice,

		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							if (el === win) {
								win.scrollTo(win.pageXOffset + vx * speed, win.pageYOffset + vy * speed);
							} else {
								vy && (el.scrollTop += vy * speed);
								vx && (el.scrollLeft += vx * speed);
							}
						}, 24);
					}
				}
			}
		}, 30),

		_prepareGroup = function (options) {
			var group = options.group;

			if (!group || typeof group != 'object') {
				group = options.group = {name: group};
			}

			['pull', 'put'].forEach(function (key) {
				if (!(key in group)) {
					group[key] = true;
				}
			});

			options.groups = ' ' + group.name + (group.put.join ? ' ' + group.put.join(' ') : '') + ' ';
		}
	;



	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;


		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			ignore: 'a, img',
			filter: null,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_onTapStart: function (/** Event|TouchEvent */evt) {
			var _this = this,
				el = this.el,
				options = this.options,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = target,
				filter = options.filter;


			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			// get the index of the dragged element within its parent
			oldIndex = _index(target);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, oldIndex);
					evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, oldIndex);
						return true;
					}
				});

				if (filter) {
					evt.preventDefault();
					return; // cancel dnd
				}
			}


			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}


			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target);
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				activeGroup = options.group;

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = true;

					// Chosen item
					_toggleClass(dragEl, _this.options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(touch);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
		},

		_triggerDragStart: function (/** Touch */touch) {
			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			}
			else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			}
			else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					document.selection.empty();
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function () {
			if (rootEl && dragEl) {
				// Apply effect
				_toggleClass(dragEl, this.options.ghostClass, true);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					groupName = ' ' + this.options.group.name + '',
					i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando] && parent[expando].options.groups.indexOf(groupName) > -1) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				var touch = evt.touches ? evt.touches[0] : evt,
					dx = touch.clientX - tapEvt.clientX,
					dy = touch.clientY - tapEvt.clientY,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
				options = this.options;

			this._offUpEvents();

			if (activeGroup.pull == 'clone') {
				cloneEl = dragEl.cloneNode(true);
				_css(cloneEl, 'display', 'none');
				rootEl.insertBefore(cloneEl, dragEl);
			}

			if (useFallback) {

				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 50);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				revert,
				options = this.options,
				group = options.group,
				groupPut = group.put,
				isOwner = (activeGroup === group),
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			moved = true;

			if (activeGroup && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: activeGroup.pull && groupPut && (
						(activeGroup.name === group.name) || // by Name
						(groupPut.indexOf && ~groupPut.indexOf(activeGroup.name)) // by Array
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (revert) {
					_cloneHide(true);

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (target = _ghostIsLast(el, evt))
				) {

					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(isOwner);

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}

						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}


					var targetRect = target.getBoundingClientRect(),
						width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect),
						after
					;

					if (moveVector !== false) {
						_silent = true;
						setTimeout(_unsilent, 30);

						_cloneHide(isOwner);

						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}
						else if (floating) {
							var elTop = dragEl.offsetTop,
								tgTop = target.offsetTop;

							if (elTop === tgTop) {
								after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
							} else {
								after = tgTop > elTop;
							}
						} else {
							after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
						}

						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}

						parentEl = dragEl.parentNode; // actualization

						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode.removeChild(ghostEl);

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl);

						if (newIndex >= 0) {
							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);

							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);
						}
					}
					else {
						// Remove clone
						cloneEl && cloneEl.parentNode.removeChild(cloneEl);

						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						if (newIndex === null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}

				// Nulling
				rootEl =
				dragEl =
				parentEl =
				ghostEl =
				nextEl =
				cloneEl =

				scrollEl =
				scrollParentEl =

				tapEvt =
				touchEvt =

				moved =
				newIndex =

				lastEl =
				lastCSS =

				activeGroup =
				Sortable.active = null;
			}
		},


		handleEvent: function (/**Event*/evt) {
			var type = evt.type;

			if (type === 'dragover' || type === 'dragenter') {
				if (dragEl) {
					this._onDragOver(evt);
					_globalDragOver(evt);
				}
			}
			else if (type === 'drop' || type === 'dragend') {
				this._onDrop(evt);
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};


	function _cloneHide(state) {
		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');
			!state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
			cloneEl.state = state;
		}
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			do {
				if (
					(tag === '>*' && el.parentNode === ctx) || (
						(tag === '' || el.nodeName.toUpperCase() == tag) &&
						(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
					)
				) {
					return el;
				}
			}
			while (el !== ctx && (el = el.parentNode));
		}

		return null;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(RSPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(RSPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		var evt = document.createEvent('Event'),
			options = (sortable || rootEl[expando]).options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt);
		}

		return retVal;
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
				rect = lastEl.getBoundingClientRect();

		return ((evt.clientY - (rect.top + rect.height) > 5) || (evt.clientX - (rect.right + rect.width) > 5)) && lastEl; // min delta
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent
	 * @param  {HTMLElement} el
	 * @return {number}
	 */
	function _index(el) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE') {
				index++;
			}
		}

		return index;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}


	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		index: _index
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.4.2';
	return Sortable;
};


factory();
// start with wrappign in an IIFE
//  then declare you angular code
(function(){
    'use strict';
    
    // define module here
    // module takes two arugments
    // first is the name of your module
    // second is an array of dependencies
    // good idea to prepent names with something
    // to avoid naming collesiosn with other libraries
    // hence the os
    angular.module('os-esri-components', [
      'ng-sortable',
      'ngTouchstart'
     
    ])
}())

(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osBasemapToggle", buildComponent())

    function buildComponent() {
       
        return {

            templateUrl: 'basemaps.html',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               baseMaps: '<'
                
            },

        }

        function osSearchController($rootScope, $scope, OsMapService) {
            var vm = this;
            vm.maps =  vm.baseMaps || ["streets" , "satellite" , "hybrid" , "topo" , "gray", "terrain" ]
            console.log(vm.baseMaps)
            vm.changeBaseMap = function(map){
                OsMapService.getMap().setBasemap(map)
            }
        }
    }

}())
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osFeatureLayer", buildComponent())

    function buildComponent() {

        return {


            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                furl: '@',
                fname: '@',
                infoTemplate: '<',
                fclick: '&'
            }


        }

        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;
            vm.$postLink = function() {
                var infoTemp = vm.infoTemplate ? vm.infoTemplate : undefined
                OsMapService.addFeatureLayer(vm.furl, vm.fname, infoTemp)
                .then(function(fLayer) {
                 var featureLayer = fLayer;
                  //broadcast layer click event to binding
                  featureLayer.on('click', function(evt) {
                        vm.fclick({evt: evt});
                    });
                 })
            }
        }
    }

}())

(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .service('OsMapService', Service)

    function Service($rootScope, $q, $timeout) {

        var serviceThis = this;

        this.map;
        this.isMapLoaded = false;

        this.layers = [];

        var thisMap;


        require(["esri/map", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/InfoTemplate", "dojo/domReady!"
            ],
            function(Map, FeatureLayer, DynamicLayer, InfoTemplate) {
                thisMap = Map;
                serviceThis.newFeatureLayer = FeatureLayer;
                serviceThis.newDynamicLayer = DynamicLayer;
                serviceThis.newInfoTemplate = InfoTemplate;
            });


        this.createMap = function(mapDefination) {

            if (thisMap) {

                this.map = new thisMap("map", mapDefination)

                this.map.on('layers-removed', function(evt) {
                   $rootScope.$emit('os-map-layerremove',{
                        map: this.map,
                        evt: evt
                    }) 
                });

                this.map.on('load', function(evt) {
                    $rootScope.$emit('os-map-loaded', {
                        evt: evt,
                        map: this.map
                    })
                });

                this.map.on('layer-add', function(evt) {
                    $rootScope.$emit('os-map-layeradd', {
                        map: this.map,
                        evt: evt
                    })
                })

                return this.map;

            }
            else {
                setTimeout(function() {
                    serviceThis.createMap(mapDefination)
                }, 200)
            }



        };

        this.getMap = function(argument) {
            return this.map;
        };

        this.addFeatureLayer = function(layerUrl, name, infoTemplate) {

            return __checkMapStatus()
                .then(function() {
                    var defination = {
                        mode: serviceThis.newFeatureLayer.MODE_SNAPSHOT,
                        outFields: ["*"],
                        infoTemplate: infoTemplate ? new serviceThis.newInfoTemplate(infoTemplate) : ""

                    }
                    var fLayer = serviceThis.newFeatureLayer(layerUrl, defination);
                    serviceThis.map.addLayer(fLayer);
                    serviceThis.layers.push({
                        id: fLayer.id,
                        name: name || " ",
                        type: 'FeatureLayer',
                        visible: fLayer.visible,
                        opacity: fLayer.opacity
                    });
                    console.log(serviceThis.layers)
                    return fLayer;
                })

        };



        this.addDynamicLayer = function(layer, name) {
            return __checkMapStatus()
                .then(function() {
                    var dLayer = serviceThis.newDynamicLayer(layer);
                    serviceThis.map.addLayer(dLayer);
                    serviceThis.layers.push({
                        id: dLayer.id,
                        name: name || " ",
                        type: 'DynamicLayer',
                        visible: dLayer.visible,
                        opacity: dLayer.opacity
                    });

                    return dLayer
                })
        };


        this.getLayer = function(layerName) {
            var layer = this.layers.filter(function(el, idx, arr) {
                return el.name === layerName;
            });
            return layer[0];

        };

        this.getLayers = function() {
            return this.layers;
        };


        function __checkMapStatus() {
            var defer = $q.defer()
            var retryLimit = 10;
            var retryCounter = 0;

            function checkMapStatus() {

                if (retryCounter >= retryLimit) {
                    defer.reject('max retry count reached')
                }

                if (serviceThis.map && serviceThis.map.loaded) {
                    defer.resolve('map loaded')
                }
                else {
                    setTimeout(function() {
                        checkMapStatus()
                    }, 100)
                }

                retryCounter++
            }

            checkMapStatus();
            return defer.promise
        }


    }


}());
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osHomeButton", buildComponent())

    function buildComponent() {
        return {


            controller: osHomeButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="HomeButton" class = "{{vm.osClass}}"> </div>'


        }

        function osHomeButtonController($rootScope, OsMapService) {
            var vm = this;

            vm.$postLink = function() {

                /*
                   this is the best way to ensure the map is loaded,
                   before trying to add anythinng, its easy to run into
                   asynchronous race conditions when seperating map
                   components
                */
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {
                    require([
                            "esri/dijit/HomeButton",
                            "dojo/domReady!"
                        ],
                        function(
                            HomeButton
                        ) {
                            var home = new HomeButton({
                                map: OsMapService.getMap()
                            }, "HomeButton");
                            home.startup();
                        });
                })
            }



        }
    }

}())


/*



*/
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osLayerList", buildComponent())

    function buildComponent() {

        return {


            controller: osLayerListController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@',
                isSortable: '<',
                layers: '<'
            },
            templateUrl: 'layerlist.html'


        }

        function osLayerListController($rootScope, $scope, OsMapService) {
           
          
            var vm = this;
            vm.test = {};
            vm.layers = [];
            vm.map = OsMapService.getMap();

            vm.barConfig = {
                group: 'foobar',
                animation: 150,
                disabled: false,
                // filter:'.mdl-slider',
                onSort: function( /** ngSortEvent */ evt) {vm.layers.forEach(function(el, idx, arr) {
                        var layer = OsMapService.getMap().getLayer(el.id);
                        OsMapService.getMap().reorderLayer(layer, idx);
                    })


                }
            }
            
            $scope.$watch("vm.test", function (newVal, oldVal) {
                for (var prop in newVal) {
                    if(newVal[prop] !== oldVal[prop]){
                         var layer = OsMapService.getMap().getLayer(prop);
                         layer.setOpacity(newVal[prop])
                        
                    }
                }
                console.log('vm.test')
                console.log(newVal)
            }, true)

            vm.stop = function(evt) {
                vm.barConfig.disabled = true;

            };
            

            vm.start = function() {
                vm.barConfig.disabled = false;
            };

            vm.setopacity = function(id, evt) {
            
              // var layer = OsMapService.getMap().getLayer(id);
               // layer.setOpacity(evt.target.value)
            }

            vm.setViz = function(id, evt) {

                var layer = OsMapService.getMap().getLayer(id);
                layer.setVisibility(evt.target.checked)

            }

            vm.finished = function() {
                setTimeout(function(argument) {
                    componentHandler.upgradeAllRegistered()
                }, 200)


            };



            $rootScope.$on('os-map-loaded', function(evt, event) {
               addLayertoList(OsMapService.getMap());
             })

            $rootScope.$on('os-map-layeradd', function() {
                addLayertoList(OsMapService.getMap());
            });
            


            function addLayertoList(map) {

               // reset layer list
               // reset ;
               
               vm.layers = []
                
               OsMapService.getLayers().forEach(function(el, idx, arr) {
        
                    var layer = OsMapService.getLayer(el.name);
                            
                    if ( isLayerinList(layer)) {
                        console.log(layer.visible)
                       vm.layers.push({
                                name:  el.name || layer._attrs.name || layer.id ,
                                id: layer.id,
                                opacity: layer.opacity,
                                visible: layer.visible
                        });
                        
                        vm.test[layer.id] = layer.opacity
                    }
                  setTimeout(function(argument) {
                          componentHandler.upgradeAllRegistered()
                     }, 200)

               });



            }
            
            function isLayerinList(layer){
              var ids =  vm.layers.map(function(x) { return x.id;})
              return ids.indexOf(layer.id) === -1
            }
        }
    }

}())


(function() {
    'use strict',



    angular
    .module("os-esri-components")
    .component("osLocateButton", buildComponent())

    function buildComponent() {

        return {


            controller: osLocateButtonController,
            controllerAs: 'vm',
            bindings: {
                osClass: '@'
            },
            template: '<div id="LocateButton" class = "{{vm.osClass}}"> </div>'


        }

        function osLocateButtonController($rootScope, OsMapService) {
            var vm = this;
          
            vm.$onInit = function() {
                $rootScope.$on('os-map-loaded', function(evt, mapEvt) {

                    require([
                            "esri/dijit/LocateButton"
                        ],
                        function(LocateButton) {

                            var geoLocate = new LocateButton({
                                map: OsMapService.getMap()
                            }, "LocateButton");
                            geoLocate.startup();

                        }
                    );
                })
            }
        }
    }

}())



(function(){
    'use strict';
    
    angular
    .module("os-esri-components")
    // think hyou cant name with dashes
    .component("osMap", mapComponent())

    function mapComponent(){
      
       return {
            bindings: {
              mapDefination: '<'
            },
            controller: osMapComponentController,
            controllerAs: 'vm',
            transclude: true,
            template: "<div id= 'map' ><ng-transclude> </ng-transclude> </div>"
        }

        function osMapComponentController($rootScope,OsMapService){
            var vm = this;
            var map;
            
            var panels = [];
           map = OsMapService.createMap(vm.mapDefination);
              
             // new Map("map",vm.mapDefination);
              
            
              
            
      
           vm.$onInit = function () {
               // body...
                  
        /*     require(["esri/map",  "dojo/domReady!"], function(Map) {
              console.log(vm.mapDefination)
              
              
            window.myMap = map;
             
              map.on('layer-add-result', function (evt) {
                console.log("layer added")
                console.log(evt)
                console.log(map.layerIds)
                console.log(map.basemapLayerIds)
                console.log('----------------------- base map --------------------')
                console.log(map.getBasemap());
                console.log("-----------------visible laysers------------------");
                console.log(map.getLayersVisibleAtScale())
                $rootScope.$emit('os-map-layeradd', {evt:evt, map: map})
            
              })
              // binds map to 'this' as a propty called map
              vm.map = map;
              
              
            });   */
            
          }
          
        }
    }   
}())



/*


*/

(function () {
    'use strict';
      console.log('activate mdl declared')
    angular
        .module ('os-esri-components')
        .directive ('mdlLoader', mdlLoader);


    function mdlLoader() {
        console.log('activate mdl directive')

        function directiveController(){
            var vm = this;
            
          
        }

        function link(scope, el, attr){
            console.log('hello mdl directive')
            console.log(attr)
            
            var watchValue = attr.mdlLoader;
            console.log(watchValue)
            console.log(scope.layers)
            
            if(Array.isArray(watchValue)){
               
                scope.$watchCollection(watchValue, function () {
                   
                    componentHandler.upgradeAllRegistered()
                })
            }else{
               
                scope.$watch(watchValue, function () {
                 
                   componentHandler.upgradeAllRegistered()
                })
            }
            
            setTimeout(function () {
                 componentHandler.upgradeAllRegistered()
            }, 0)
            
        }

        return {
            bindToController: true,
            controller: directiveController,
            controllerAs: 'Ctrl',
            link: link,
            restrict: 'A',
            scope: true
           
                   
            
        }
    }

} ());
(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osDynamicLayer", buildComponent())

    function buildComponent() {

        return {


            controller: osFeatureLayercontroller,
            controllerAs: 'vm',
            bindings: {
                durl: '@',
                dname: '@',
                osInfoTemplateTitle: '@',
                osInfoTemplateBody: '@'
            },
            require: {

                "mapCtrl": "^osMap"

            },


        }

        function osFeatureLayercontroller($rootScope, OsMapService) {
            var vm = this;

            vm.$postLink = function() {
                OsMapService.addDynamicLayer(vm.durl, vm.dname)
            };
        }
    }

}())

(function() {
    'use strict',


    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array

    angular
    .module("os-esri-components")
    .component("osSearch", buildComponent())

    function buildComponent() {
       
        return {

            template: '<div id="search"></div>',
            controller: osSearchController,
            controllerAs: 'vm',
            bindings: {
                
               // osClass: '@'
                
            },
            require: {

                "mapCtrl": "^osMap"

            },

        }

        function osSearchController() {
            var vm = this;

            vm.$postLink = function() {

                require([

                    "esri/dijit/Search",
                     "dojo/domReady!"

                ], function(Search) {

                    var search = new Search({
                         enableButtonMode: true, //this enables the search widget to display as a single button
                     enableLabel: false,
                     enableInfoWindow: true,
                     showInfoWindowOnSelect: false,
                        map: vm.mapCtrl.map
                    }, "search");
                    search.startup();

                });
            }
        }
    }

}())
(function (){
    'use strict',
    
    
    // declare angular module name 
    // then a component name
    // then a fucntion that returns a componnent defination object
    // only when you ar first defining a module do you need the depency array
    
    angular
    .module("os-esri-components")
    .component("testComponent",  testComponent())
    
    function testComponent (){
        
        return {
            bindings: {},
             require: {
                parent : '^osMap'

           },
            template: '<h1> Hello from angualr </h1>',
            controller: function () {
                var vm = this;
                
                console.log(vm.parent)
                
            },
            controllerAs: 'vm',
        }
    }
    
}())
angular.module('os-esri-components').directive('ngDraggable', function($document, $window) {
    function makeDraggable(scope, element, attr) {
        var startX = 0;
        var startY = 0;

        // Start with a random pos
        var x =0
        var y = 0

       

        element.on('mousedown', function(event) {
            //event.preventDefault();

            startX = event.pageX - x
            startY = event.pageY - y

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;

            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    }
    return {
        link: makeDraggable
    };
});
(function() {
    'use strict';

    angular
        .module('os-esri-components')
        .controller('main', ControllerController);

    ControllerController.$inject = ['$scope', '$rootScope', 'OsMapService'];

    function ControllerController($scop, $rootScope, OsMapService) {
        var vm = this;
        vm.showLayers = false;
        vm.showBasemaps = false;

        activate();

        ////////////////

        function activate() {


        }
        
        vm.maps =   ["streets" , "satellite" ]

        vm.wellsInfo = {
            title: "Wells",
            content: "Current Owner: ${CURR_OWNER}</br>" +
                "Original Owner: ${ORIG_OWNER}</br>ID : ${well_id} </br>USE: ${USE_ }</br>"
        }
        
         vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };
        vm.togleLayers = function(argument) {
            vm.showLayers = !vm.showLayers;
        };

        vm.toggleBaseMaps = function() {
            vm.showBasemaps = !vm.showBasemaps;
        };


        vm.bMapShow = function(isVisible) {
            vm.showBasemaps = isVisible
        };

        vm.layersShow = function(isVisible) {
            vm.showLayers = isVisible
        };

        vm.testClick = function(e) {
            console.log('test click');
            console.log(e);

            alert(JSON.stringify(e.graphic.geometry))
            alert(JSON.stringify(e.graphic.attributes))
        };



    }
})();