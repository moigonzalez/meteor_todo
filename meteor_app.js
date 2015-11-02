Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted

      var text = event.target.text.value;
      var importantValue = event.target.important_task.checked;
      var blueTag = event.target.blue_tag.checked;
      var yellowTag = event.target.yellow_tag.checked;
      var pinkTag = event.target.pink_tag.checked;
      var date = new Date();
      date = date.toDateString();

      if (text == '') {
        alert('Plz fill title');
        return;
      }

      Tasks.insert({
        text: text,
        createdAt: date, // current time
        important: importantValue,
        blue: blueTag,
        yellow: yellowTag,
        pink: pinkTag
      });

      // Clear form
      event.target.text.value = "";
      event.target.important_task.checked = false;
      event.target.blue_tag.checked = false;
      event.target.yellow_tag.checked = false;
      event.target.pink_tag.checked = false;

      // Prevent default form submit
      return false;
    }
  
  });

  Template.body.helpers({
    tasks: function () {
      // Show newest tasks first
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "click .sort-asc": function () {
      console.log(Tasks.find({}, {sort: {createdAt: 1}}));
      return Tasks.find({}, {sort: {createdAt: 1}});
    },
    "click .sort-desc": function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    },
    "click .show-important": function () {
      console.log('test');
      return Tasks.find({}, {fields: {important: 1}});
    }
  });

  Template.task.onRendered (function() {
    applySortable();
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function (event) {
      deleteTaskSlide(event, this);
    },
    "click .toggle-important": function (event) {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {important: ! this.important}});
    },
  });

}

function deleteTaskSlide(event, taskDeleted) {
  var htmlElement = event.target.parentElement;
  $(htmlElement).animate(
    {right:'100%'}
  ,600, function (){
    Tasks.remove(taskDeleted._id);
  });
}

function applySortable(){
  $('#sortable').sortable({
    items: '> li'
  });
}