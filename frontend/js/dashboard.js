var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;


$(document).ready(function() {
  
  updateRooms();

  $('body').bootstrapMaterialDesign();

  $sidebar = $('.sidebar');

  window_width = $(window).width();

  // check if there is an image set for the sidebar's background
  md.checkSidebarImage();

  $('.form-control').on("focus", function() {
    $(this).parent('.input-group').addClass("input-group-focus");
  }).on("blur", function() {
    $(this).parent(".input-group").removeClass("input-group-focus");
  });

  console.log( BMSGraph );
  // set endpoint, remote or local
  //window.BMSGraphClient = BMSGraph.use( 'http://192.168.1.119/graphql' );
  //window.NFCAccessClient = NFCAccess.use( 'ws://localhost:8084' );


  /*window.getRoomsDataFct = function getRoomsData() {
    //console.log("Getting data");
    // check if user is logged in
    BMSGraphClient.facility.getRooms().then( ( message ) => 
      {
        //console.log(message.data);
        for(i = 0; i < message.data.length; i++) {
          if( message.data[i].state != null ) {
            room_nb = message.data[i].number;
            room_temp = message.data[i].state.temperature;
            //console.log( room_nb, room_temp );
            if( room_nb > 100 && room_nb < 1010 ) {
              $('#room-' + room_nb + '-temperature').html(room_temp.toString() + ' &deg; C');
              
            //<h3 class='card-category' id='room-" + room_nb.toString() + "-temperature'>23 \
            //                          <small>degrees</small> \
            //                          </h3>
            }
          }
        }
      });
  }*/
  
  function floor_tag_click( element )
  {
    //console.log( element.dataset[ 'floorNum' ] );
    $("#floor-" + element.dataset[ 'floorNum' ].toString()).toggle(600);
    var text = $("#floor-" + element.dataset[ 'floorNum' ].toString() +"-tag-text").text();
    if( text == "Click to see all rooms" ) {
      $("#floor-" + element.dataset[ 'floorNum' ].toString() +"-tag-text").text("Click to collapse room list");
    }
    else {
      $("#floor-" + element.dataset[ 'floorNum' ].toString() +"-tag-text").text("Click to see all rooms");
    }
  }

  window.floor_tag_click = floor_tag_click;

  var cards = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th"];
  for( floor = 2; floor < 12; floor++) {
    //console.log("floor " + floor);
    $('#main-container-dashboard').append("<div class='card card-plain clickable-card' onclick='javascript:floor_tag_click(this)' data-floor-num='"+floor.toString()+"' id='floor-" + floor.toString() + "-tag'> \
                                  <div class='card-header card-header-info'> \
                                    <h4 class='card-title'>" + floor.toString() + "<sup>" + cards[floor] + "</sup> Floor</h4> \
                                    <p class='card-category' id='floor-" + floor.toString() + "-tag-text'>Click to see all rooms \
                                    </p> \
                                  </div> \
                                </div> \
                                <div id='floor-" + floor.toString() + "' style='display: none;'>");
    row_nb = floor;// - 1;
    $("#floor-" + floor.toString()).append("<div class='row' id='row-" + row_nb.toString() + "'>");
    /*
      * <!-- card-header-warning - yellow \
      * card-header-success - green
      * card-header-danger  - red
      * card-header-info    - info -->
      * */

     var rooms_per_floor;
     var column_width_class;
     
     if( floor == 11 ) {
       rooms_per_floor = 6;
       column_width_class = 'col-lg-4';
     }
     else {
       rooms_per_floor = 10;
       column_width_class = 'col-lg-2';
     }
     
    for( card = 1; card <= rooms_per_floor; card ++ ) {
      var room_nb = floor * 100 + card; //(floor - 1) * 100 + card;
      //console.log("room nb " + room_nb);
      $("#row-" + row_nb.toString()).append("<div class='" + column_width_class + " col-md-8 col-sm-8'> \
                                              <div class='card card-stats'> \
                                                <div class='card-header card-header-icon' id='room-" + room_nb.toString() + "-status'> \
                                                  <div class='card-icon'> \
                                                  </div> \
                                                  <h3 class='card-title'>Room " + room_nb.toString() + "</h3> \
                                                  <h3 class='card-category' id='room-" + room_nb.toString() + "-temperature'>23 &deg; C </h3> \
                                                </div> \
                                                <div class='card-footer'> \
                                                  <div class='stats'> \
                                                    <img src='img/window_closed.png' style='height: 25px;' id='window-icon-" + room_nb.toString() + "'> \
                                                    <img src='img/heater_closed.png' style='height: 22px; margin-left:10px;' id='heater-icon-" + room_nb.toString() + "'> \
                                                    <img src='img/ac_closed.png' style='width: 27px; margin-left:10px;' id='ac-icon-" + room_nb.toString() + "'> \
                                                  </div> \
                                                </div> \
                                              </div> \
                                              </div>");
      }
    
  }

  for (i = 2; i < 12; i++) {
    $('#floor-' + i.toString() +'-tag-text').text("Click to see all rooms");
  }
});

/*function check_password( notification ) 
{
  var username = BMSGraphClient.account.getUserData().username;
  var password = document.getElementById("popup_password").value;
  console.log(username, password);
  // get token for some credentials and set the token
  BMSGraphClient.account.login( username, password ).then( ( response ) => 
  { 
    console.log( response );
      // check success or fail
      if( response.success ) 
      {
          // may use this token for some specific requests
          BMSGraphClient.account.useToken( response.data.token );

          // save token in client persistent storage 
          BMSGraphClient.account.saveToken( response.data.token );

          console.log( 'Password check success!' );
          
          //window.location = "notifications.html"; // Redirecting to other page.
          notification.close();
          return false;
      }
      // failed, display massage if any
      else
      {
          console.log( 'Password not ok!' );
          //attempt --;// Decrementing by one.
          //alert();
          $("#alert_modal").modal();
          $("#close_modal").click( ( evt ) => {
            $("#popup_password").val("")
            $("#login_modal").modal();
          });
          
      }
 }, ( err ) => {
  console.log( 'NUUUUUUUU', err );
 });

}*/

function setTempFromAC( room )
{   
    return BMSGraphClient.facility.ac.getUnit( room ).then( function( ac_unit_data ) 
    {
        $('#room-' + room.toString() + '-temperature').html( parseFloat(ac_unit_data.data.roomTemperature).toFixed(1) + ' &deg; C ' );
    });
}


 function updateRooms() {
    BMSGraphClient.facility.getRooms().then( ( response ) => 
    {
      response.data.forEach(function (room, index) {
        //console.log(room, index);
        var room_status_div = $('#room-' + room.number.toString() + '-status').get( 0 );
        var room_classes = ['card-header-free', 'card-header-occupied', 'card-header-dnd', 'card-header-clean', 'card-header-unknown'];

        room_classes.map( ( cls ) => { room_status_div.classList.remove( cls ); } );

        if( room.state ) 
        {
          //console.log(room, index);
          if( parseFloat(room.state.temperature) >= 5 && parseFloat(room.state.temperature) <= 35 )
            $('#room-' + room.number.toString() + '-temperature').html( parseFloat(room.state.temperature).toFixed(1) + ' &deg; C ' );
          else
            setTempFromAC( room.number );

          if( room.state.window && room.state.window.toString() === 'true' ) {
            // $('#event-icon-' + room.number.toString()).html('warning'); $('#event-icon-' + room.number.toString()).addClass('text-danger'); $('#event-text-' + room.number.toString()).html('Window Opened');
            $('#window-icon-' + room.number.toString()).attr('src', 'img/window_open.png');
          }
          else {
            // $('#event-icon-' + room.number.toString()).html('update'); $('#event-icon-' + room.number.toString()).removeClass('text-danger'); $('#event-text-' + room.number.toString()).html('No recent events');
            $('#window-icon-' + room.number.toString()).attr('src', 'img/window_closed.png');
          }

          if( room.state.heater && room.state.heater.toString() === 'true' ) {
            $('#heater-icon-' + room.number.toString()).attr('src', 'img/heater_open.png');
          }
          else {
            $('#heater-icon-' + room.number.toString()).attr('src', 'img/heater_closed.png');
          }          

          if( room_classes.indexOf( `card-header-${ room.state.state }` ) >= 0 )
          {
            room_status_div.classList.add( `card-header-${ room.state.state }` );
          }
          else
          {
            room_status_div.classList.add( 'card-header-unknown' );
          }
        }
        else {
          room_status_div.classList.add( 'card-header-unknown' );
        }

        if( room.acError && room.acError.toString() == 'true' )
        {
          $('#ac-icon-' + room.number.toString()).attr('src', 'img/ac_broke.png');
        }
        else
        {
          if( room.ac && room.ac.toString() == 'true' ) {
            $('#ac-icon-' + room.number.toString()).attr('src', 'img/ac_open.png');
          }
          else {
            $('#ac-icon-' + room.number.toString()).attr('src', 'img/ac_closed.png');
          }
        }
      });

    });
 }

var roomUpdateInterval = setInterval(updateRooms, 5000);

var popup_login_content = "<center> \
<span>Enter password to confirm event action!</span> \
<br> \
<form> \
<input type = 'password' id='popup_password' placeholder = '******'> \
<button class='templatemo-blue-button width-100' id='confirm_action'>Confirm</button> \
</form> \
</center>";

var alert_notification_staff = "<center> \
<span>Flood on room X!</span> \
<br> \
<button class='templatemo-blue-button width-100' id='snooze_notification'>Snooze</button> \
<button class='templatemo-blue-button width-100' id='in_progress_notification'>Set in progress</button> \
</center>";

var alert_notification_admin = "<center> \
<span>Flood on room X!</span> \
<br> \
<button class='templatemo-blue-button width-100' id='snooze_notification'>Snooze</button> \
<button class='templatemo-blue-button width-100' id='in_progress_notification'>Set in progress</button> \
<button class='templatemo-blue-button width-100' id='clear_notification'>Clear</button> \
</center>";


$(".close").click(function(){
  console.log("Notification Closed");
  //$(".close"). attr("data-dismiss", "alert");
});

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

