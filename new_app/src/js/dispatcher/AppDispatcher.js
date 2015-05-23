/**
 * Created by omelvin on 5/22/15.
 *
 * boilerplate dispatcher taken from the flux todo-list example
 * https://facebook.github.io/flux/docs/todo-list.html#content
 */


//var Dispatcher = require('./Dispatcher');
//var assign = require('object-assign');
//
//var AppDispatcher = assign({}, Dispatcher.prototype, {
//
//    /**
//     * A bridge function between the views and the dispatcher, marking the action
//     * as a view action.  Another variant here could be handleServerAction.
//     * @param  {object} action The data coming from the view.
//     */
//    handleViewAction: function(action) {
//        this.dispatch({
//            source: 'VIEW_ACTION',
//            action: action
//        });
//    }
//
//});
//
//module.exports = AppDispatcher;


//If I understand the tutorial this official dispatcher replaces the need to use the boilerplate dispatcher
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();