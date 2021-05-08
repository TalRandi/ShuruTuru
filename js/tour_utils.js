$(document).ready(function () {
   
  $("form[name='user_form']").validate({
    // Specify validation rules
    rules: {
      "ID":{
        required: true,
      },
      "StartingDate": {
        required: true,
      },
      "Duration":{
        required: true
      },
      "Cost":{
        required: true,
        number: true
      },
      "guideName":{
        required: true
      },
      "guideEmail":{
        required: true,
        email: true
      },
      "guidePhone":{
        required: true
      }
    },
    // Specify validation error messages
    messages: {       
      "guideEmail":{
        email: "email structure is some@domain"
      },
      "Cost":{
        number: "Only digits allowed"
      }
    }
  });

  $("form[name='edit_form']").validate({
    // Specify validation rules
    
    rules: {
      "ID":{
        required: true,
      },
      "StartingDate": {
        required: true,
      },
      "Duration":{
        required: true
      },
      "Cost":{
        required: true,
        number: true
      },
      "guideName":{
        required: true
      },
      "guideEmail":{
        required: true,
        email: true
      },
      "guidePhone":{
        required: true
      }
    },
    // Specify validation error messages
    messages: {       
      "guideEmail":{
        email: "email structure is some@domain"
      },
      "Cost":{
        number: "Only digits allowed"
      }
    }
  });

  // process the form
  $('#user_form').submit(function (event) {
      if(!$("#user_form").valid()) return;
      // process the form
      $.ajax({
          type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
          url: '/tours', // the url where we want to POST
          contentType: 'application/json',
          data: JSON.stringify({
              "tour_name": $("#ID").val(),
              "start_date": $("#StartingDate").val(),
              "duration": parseInt($('#Duration').val()),
              "cost": parseInt($('#Cost').val()),
              "guide":{
                "name" : $("#guideName").val(),
                "email" : $("#guideEmail").val(),
                "phone" : $("#guidePhone").val()              
              }
          }),
          processData: false,            
          encode: true,
          success: function( data, textStatus, jQxhr ){
            alert("Tour added successfully")
            location.href = "/list";
          },
          error: function( jqXhr, textStatus, errorThrown ){
              console.log( errorThrown );
              if( errorThrown == 'Bad Request')
                alert('Tour is already exist')
          }            
      })
      //Clear input
      $("#ID").val("")
      $("#StartingDate").val("")
      $("#Duration").val("")
      $("#Cost").val("")
      $("#guideName").val("")
      $("#guideEmail").val("")
      $("#guidePhone").val("")   
        
      // stop the form from submitting the normal way and refreshing the page
      event.preventDefault();
  });
});
