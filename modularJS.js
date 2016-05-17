var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

var other_APP = (function(){
	// cache DOM
	var
		parent =   document.getElementById('peopleModule'),
		counter =  parent.querySelector('.counter'),
		str =      parent.querySelector('.str'),
		time =     parent.querySelector('.time');

	var _counter = function(peoplesArr){
		counter.innerHTML = peoplesArr.length;
	};
	var _makeStr = function(peoplesArr){
		str.innerHTML = peoplesArr.join(' | ');
	};
	var _lastUpdated = function(){
		time.innerHTML = new Date;
	}

	events.on('peopleChanged', _counter);
	events.on('peopleChanged', _makeStr);
	events.on('peopleChanged', _lastUpdated);
})();

var APP = (function(){
	var peoples = ['Will', 'Jack', 'Ron', 'Math', 'Jo'];

	// cache DOM
	var
		parent =   document.getElementById('peopleModule'),
		input =    parent.getElementsByTagName('input')[0],
		btn =      parent.getElementsByTagName('button')[0],
		list =     parent.getElementsByTagName('ul')[0],
		template = document.getElementById('people-template').innerHTML;

	// render DOM 
	var _render = function(){
		var data = { peoples: peoples };
		list.innerHTML = Mustache.render(template, data);
	};

	var addPerson = function(value){
		var person = (typeof value === 'string') ? value : input.value;
		if (!person.length > 0) return;
		peoples.push(person);
		input.value = '';
		events.emit('peopleChanged', peoples);
	};

	var removePerson = function(index){
		var i;
		if(typeof index === 'number') {
			i = index;
		} else if (index.target.getAttribute('data-event') === 'delete') {
			// index = event
			i = peoples.indexOf( index.target.parentNode.querySelector('span').innerHTML );
		}
		if (i >= 0) {
			peoples.splice(i, 1);
			events.emit('peopleChanged', peoples);
		}
	};

	// bind events
	btn.addEventListener('click', addPerson);
	list.addEventListener('click', removePerson);

	// publish/subscribe events
	events.on('peopleChanged', _render);
	events.emit('peopleChanged', peoples);
})();