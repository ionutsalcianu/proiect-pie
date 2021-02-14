(function() {
  isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

    $('html').addClass('perfect-scrollbar-on');
  } else {
    $('html').addClass('perfect-scrollbar-off');
  }
})();


var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
  mobile_menu_initialized = false,
  toggle_initialized = false,
  bootstrap_nav_initialized = false;

const HVAC_OPTION = {
    AC: 0,
    HEATER: 1
 };

const HEATER_GLOBAL_OPTION = {
  ON: 0,
  OFF: 1,
  AUTO: 2
};

var hvac_option_selected = HVAC_OPTION.HEATER;
var heater_no_client_global_option = HEATER_GLOBAL_OPTION.AUTO;

function getFacilityOptions(  )
{
    return BMSGraphClient.facility.getOptions( ).then( function( facility ) 
    {
        console.log( 'FACILITY OPTIONS: ', facility.data ); 
        switch( facility.data.hvacMode ){
          case 'ac_cooling':
            $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_selected.png');
            $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_not_selected.png');
            $('#hvac_radiator').attr('src', 'img/hvac_radiator_not_selected.png');
            hvac_option_selected = HVAC_OPTION.AC;
            
            $('#radiator_no_client_global_text').hide();
            $('#heater_option_icon_global').hide();
            break;
          case 'ac_heating':
            $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_not_selected.png');
            $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_selected.png');
            $('#hvac_radiator').attr('src', 'img/hvac_radiator_not_selected.png');
            hvac_option_selected = HVAC_OPTION.AC;

            $('#radiator_no_client_global_text').hide();
            $('#heater_option_icon_global').hide();
            break;

          case 'rd_heating':
            $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_not_selected.png');
            $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_not_selected.png');
            $('#hvac_radiator').attr('src', 'img/hvac_radiator_selected.png');
            hvac_option_selected = HVAC_OPTION.HEATER;

            $('#radiator_no_client_global_text').show();
            $('#heater_option_icon_global').show();

            switch( facility.data.idleHeating ) 
            {
              case HEATER_GLOBAL_OPTION.OFF:
                $('#heater_off_global').attr('src', 'img/heater_closed_selected.png');
                $('#heater_on_global').attr('src', 'img/heater_open.png');
                $('#heater_auto_global').attr('src', 'img/heater_auto.png');
                break;
              case HEATER_GLOBAL_OPTION.ON:
                $('#heater_off_global').attr('src', 'img/heater_closed.png');
                $('#heater_on_global').attr('src', 'img/heater_open_selected.png');
                $('#heater_auto_global').attr('src', 'img/heater_auto.png');
                break;
              case HEATER_GLOBAL_OPTION.AUTO:
                $('#heater_off_global').attr('src', 'img/heater_closed.png');
                $('#heater_on_global').attr('src', 'img/heater_open.png');
                $('#heater_auto_global').attr('src', 'img/heater_auto_selected.png');
                break;
            }

            $("#temp_global").val(facility.data.idleHeatingSetpoint);

            break;
          }

        updateRoomCardsWithHVACOption();

        switch( facility.data.acFanSpeed ) {
          case 'low':
            $('#fan_speed_low').attr('src', 'img/fan_active.png');
            break;
          case 'medium':
            $('#fan_speed_medium').attr('src', 'img/fan_active.png');
            break;
          case 'high':
            $('#fan_speed_high').attr('src', 'img/fan_active.png');
            break;
          case 'powerful':
            $('#fan_speed_powerful').attr('src', 'img/fan_active.png');
            break;
        }
        
    });
}

function updateRoomCardsWithHVACOption( ) 
{
  for( floor = 2; floor < 12; floor++) 
  {
    var rooms_per_floor;
    
    //console.log(">>>>>>>>>>", hvac_option_selected, HVAC_OPTION.HEATER);
    if( floor == 11 ) {
      rooms_per_floor = 6;
    }
    else {
      rooms_per_floor = 10;
    }

      for( card = 1; card <= rooms_per_floor; card ++ ) {
        var room_nb = floor * 100 + card;
        if( hvac_option_selected != HVAC_OPTION.HEATER )
        {
          $("#heater_option_icon_" + room_nb.toString()).hide();
          $("#heater_option_text_" + room_nb.toString()).hide();
        }
        else
        {
          $("#heater_option_icon_" + room_nb.toString()).show();
          $("#heater_option_text_" + room_nb.toString()).show();
        }
        
      }
    }
}


function updateRoomsTemp( ) 
{
  for( floor = 2; floor < 12; floor++) 
  {
    var rooms_per_floor;
    
    if( floor == 11 ) rooms_per_floor = 6;
    else rooms_per_floor = 10;

      for( card = 1; card <= rooms_per_floor; card ++ ) {
        var room_nb = floor * 100 + card;
        $("#temp_room_" + room_nb.toString()).val(global_setpoint);
      }
    }
}

function updateHeaterOptionAllRooms( ) 
{
  global_setpoint = parseInt( $("#temp_global").val() );
  for( floor = 2; floor < 12; floor++) 
  {
    var rooms_per_floor;
    
    if( floor == 11 ) {
      rooms_per_floor = 6;
    }
    else {
      rooms_per_floor = 10;
    }

      for( card = 1; card <= rooms_per_floor; card ++ ) {
        var room_nb = floor * 100 + card;
        if( heater_no_client_global_option == HEATER_GLOBAL_OPTION.OFF )
        {
          $("#heater_off_" + room_nb.toString()).attr('src', 'img/heater_closed_selected.png');
          $("#heater_on_" + room_nb.toString()).attr('src', 'img/heater_open.png');
          $("#heater_auto_" + room_nb.toString()).attr('src', 'img/heater_auto.png');
        }
        else if( heater_no_client_global_option == HEATER_GLOBAL_OPTION.ON )
        {
          $("#heater_off_" + room_nb.toString()).attr('src', 'img/heater_closed.png');
          $("#heater_on_" + room_nb.toString()).attr('src', 'img/heater_open_selected.png');
          $("#heater_auto_" + room_nb.toString()).attr('src', 'img/heater_auto.png');
        }
        else
        {
          $("#heater_off_" + room_nb.toString()).attr('src', 'img/heater_closed.png');
          $("#heater_on_" + room_nb.toString()).attr('src', 'img/heater_open.png');
          $("#heater_auto_" + room_nb.toString()).attr('src', 'img/heater_auto_selected.png');
          //$("#temp_room_" + room_nb.toString()).val(global_setpoint);
        }
      }
    }
    return BMSGraphClient.facility.setOptions( {
        idleHeating: heater_no_client_global_option,  // 0 - heat while client away, 1 - heat off, 2 - temperaturecontrol using the setpoint temperature
        idleHeatingSetpoint: global_setpoint
    }).then( ( response ) => 
    {
        console.log( 'GLOBAL IDLE HEATING CHANGED', response );
    });
}

function setRoomHeatingModeNoClient( room, mode, setpoint )
{
    // return BMSGraphClient.facility.setRoomIdleHeating( room, mode, setpoint ).then( ( response ) => 
    // {
    //     console.log( 'ROOM IDLE HEATING CHANGED', response );
    // });
    return BMSGraphClient.facility.getOptions( ).then( ( response ) => 
    {
        console.log( 'ROOM IDLE HEATING CHANGED', response );
    });
} 


function setGlobalHeatingNoClient(  )
{
    // create new account
    return BMSGraphClient.facility.setOptions( {
        idleHeating: 2,  // 0 - heat while client away, 1 - heat off, 2 - temperaturecontrol using the setpoint temperature
        idleHeatingSetpoint: 13
    }).then( ( response ) => 
    {
        console.log( 'GLOBAL IDLE HEATING CHANGED', response );
    });
}

function updateRooms() {
  BMSGraphClient.facility.getRooms().then( ( response ) => 
  {
    //console.log(">>>>>>", response);
    response.data.forEach(function (room, index) {
      //console.log(room, index);
      var room_status_div = $('#room-' + room.number.toString() + '-status').get( 0 );
      var room_classes = ['card-header-free', 'card-header-occupied', 'card-header-dnd', 'card-header-clean', 'card-header-unknown'];

      room_classes.map( ( cls ) => { room_status_div.classList.remove( cls ); } );

      if( room.state ) 
      {
        console.log(room, index);
        if( room.ignore ) {
          $('#ignore_window_input_' + room.number.toString()).prop('checked', true);
        }
        else {
          $('#ignore_window_input_' + room.number.toString()).prop('checked', false);
        }

        if( room.ac ) {
          $('#ac_state_room_' + room.number.toString()).prop('checked', true);
        }
        else {
          $('#ac_state_room_' + room.number.toString()).prop('checked', false);
        }

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

        if( room.ac && room.ac.toString() == 'true' ) {
          $('#ac-icon-' + room.number.toString()).attr('src', 'img/ac_open.png');
        }
        else {
          $('#ac-icon-' + room.number.toString()).attr('src', 'img/ac_closed.png');
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
      if( hvac_option_selected == HVAC_OPTION.HEATER ) { 
        $('#temp_room_' + room.number.toString()).val(room.idleHeatingSetpoint);
        switch( room.idleHeating ) 
        {
          case HEATER_GLOBAL_OPTION.OFF:
            $('#heater_off_' + room.number.toString()).attr('src', 'img/heater_closed_selected.png');
            $('#heater_on_' + room.number.toString()).attr('src', 'img/heater_open.png');
            $('#heater_auto_' + room.number.toString()).attr('src', 'img/heater_auto.png');
            break;
          case HEATER_GLOBAL_OPTION.ON:
            $('#heater_off_' + room.number.toString()).attr('src', 'img/heater_closed.png');
            $('#heater_on_' + room.number.toString()).attr('src', 'img/heater_open_selected.png');
            $('#heater_auto_' + room.number.toString()).attr('src', 'img/heater_auto.png');
            break;
          case HEATER_GLOBAL_OPTION.AUTO:
            $('#heater_off_' + room.number.toString()).attr('src', 'img/heater_closed.png');
            $('#heater_on_' + room.number.toString()).attr('src', 'img/heater_open.png');
            $('#heater_auto_' + room.number.toString()).attr('src', 'img/heater_auto_selected.png');
            break;
        }
      }
    });

  });
}

var roomUpdateInterval = setInterval(updateRooms, 5000);

window.getRoomsDataFct = function getRoomsData() {
  console.log("Getting data");
  // check if user is logged in
  BMSGraphClient.facility.getRooms().then( ( message ) => 
    {
      //console.log(message.data);
      for(i = 0; i < message.data.length; i++) {
        if( message.data[i].state != null ) {
          room_nb = message.data[i].number;
          room_temp = parseFloat(message.data[i].state.temperature).toFixed(2);
          console.log( room_nb, room_temp );
          if( room_nb > 100 && room_nb < 1010 ) {
            $('#room-' + room_nb + '-temperature').html(room_temp.toString() + ' &deg; C');
          /*<h3 class='card-category' id='room-" + room_nb.toString() + "-temperature'>23 \
                                    <small>degrees</small> \
                                    </h3>*/
          }
        }
      }
    });
}

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

$(document).ready(function() {

  var WINTER = true;

  getFacilityOptions();
  updateRooms();

  $('body').bootstrapMaterialDesign();
  $sidebar = $('.sidebar');
  md.initSidebarsCheck();
  window_width = $(window).width();

  // check if there is an image set for the sidebar's background
  md.checkSidebarImage();


  var cards = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th"];
  for( floor = 2; floor < 12; floor++) {
    //console.log("floor " + floor);
    $('#main-container-settings').append("<div class='card card-plain clickable-card' onclick='javascript:floor_tag_click(this)' data-floor-num='"+floor.toString()+"' id='floor-" + floor.toString() + "-tag'> \
                                  <div class='card-header card-header-info'> \
                                    <h4 class='card-title'>" + floor.toString() + "<sup>" + cards[floor] + "</sup> Floor</h4> \
                                    <p class='card-category' id='floor-" + floor.toString() + "-tag-text'>Click to see all rooms \
                                    </p> \
                                  </div> \
                                </div> \
                                <div id='floor-" + floor.toString() + "' style='display: none;'>");
    row_nb = floor;
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
        var room_nb = floor * 100 + card;
        $("#row-" + row_nb.toString()).append("<div class='" + column_width_class + "'> \
                                                <div class='card card-stats'> \
                                                  <div class='card-header card-header-icon' id='room-" + room_nb.toString() + "-status'> \
                                                    <div class='card-icon'> \
                                                    </div> \
                                                    <h3 class='card-title'>Room " + room_nb.toString() + "</h3> \
                                                    <div class='row' style='display:flex;margin-bottom:auto;' > \
                                                      <div class='column' style='height:100%;' id='room-" + room_nb.toString() + "-settings-names'> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 5%; margin-bottom: auto;'>Set Room Temp </h4> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 6%; margin-bottom: auto;'>Ignore Window </h4> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 5%; margin-bottom: auto;'>AC On/Off  </h4> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 7%; margin-bottom: auto;'>AC Fan Speed  </h4> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 10%; margin-bottom: auto;'>Reset Room </h4> \
                                                        <h4 style='color: #6c757d; height: 20%; margin-top: 10%; margin-bottom: auto;' id='heater_option_text_"+ room_nb.toString() +"'>Heater No Client </h4> \
                                                      </div> \
                                                      <div class='column' style='height:100%;' id='room-" + room_nb.toString() + "-settings-icons'> \
                                                        <div class='form-group' style='display: flex; height: 20%;'> \
                                                          <div style='flex: 25%;'> </div>\
                                                          <input type='text' class='form-control' style='text-align: right; flex: 30%; height: 20px;' id='temp_room_" + room_nb.toString() + "'> \
                                                          <div style='color:#6c757d; flex: 15%; margin-left:auto;'>&deg; C </div> \
                                                          <div style='flex: 20%;' id='set_temp_room_" + room_nb.toString() + "'> \
                                                          <img src='img/checked.png' style='height: 15px; margin-right: 5%;' id='img_set_temp_room_" + room_nb.toString() + "'> </div> \
                                                          <div style='flex: 15%;'> </div>\
                                                        </div> \
                                                        \
                                                        <div style='margin-right:40%; margin-left:auto; height: 20%;' id='ignore_window_" + room_nb.toString() + "'> \
                                                          <label class='switch'> \
                                                            <input type='checkbox' id='ignore_window_input_" + room_nb.toString() + "'> \
                                                            <span class='slider round'></span> \
                                                          </label> \
                                                        </div> \
                                                        \
                                                        <div style='margin-right:40%; margin-left:auto; height: 20%;'> \
                                                          <label class='switch'> \
                                                            <input type='checkbox' id='ac_state_room_" + room_nb.toString() + "' style='margin-right:2rem;' checked> \
                                                            <span class='slider round'></span> \
                                                          </label> \
                                                        </div> \
                                                        \
                                                        <div style='margin-left:0%; margin-right:10%; height:20%;'> \
                                                          <img src='img/fan.png' id='fan_speed_low_" + room_nb.toString() + "' style='width: 15px; margin-right: 1%;'> \
                                                          <img src='img/fan.png' id='fan_speed_medium_" + room_nb.toString() + "' style='width: 20px; margin-right: 1%;'> \
                                                          <img src='img/fan.png' id='fan_speed_high_" + room_nb.toString() + "' style='width: 25px; margin-right: 1%;'> \
                                                          <img src='img/fan.png' id='fan_speed_powerful_" + room_nb.toString() + "' style='width: 30px; margin-right: 1%;'> \
                                                        </div> \
                                                        \
                                                        <div style='margin-right:40%; margin-left:auto; height: 20%; margin-top: 5%;'> \
                                                          <button class='btn btn-info' id='reset_room_" + room_nb.toString() + "' style='height: 25%; width:15%; margin-left: 40%; margin-right: auto; margin-top: 5%;'></button> \
                                                        </div> \
                                                        \
                                                        <div style='margin-right:10%; margin-left:auto; height:20%; margin-top: 5%;' id='heater_option_icon_"+ room_nb.toString() +"'> \
                                                          <img src='img/heater_closed.png' id='heater_off_" + room_nb.toString() + "' style='width: 30px; margin-left:3%; margin-right:2%;'> \
                                                          <img src='img/heater_open.png' id='heater_on_" + room_nb.toString() + "' style='width: 30px; margin-left:3%; margin-right:2%;'> \
                                                          <img src='img/heater_auto.png' id='heater_auto_" + room_nb.toString() + "' style='width: 30px; margin-left:3%; margin-right:2%;'> \
                                                        </div> \
                                                        \
                                                      </div> \
                                                    </div> \
                                                  </div> \
                                                    \
                                                    \
                                                  <div class='card-footer'> \
                                                    <div class='stats'> \
                                                      <img src='img/window_closed.png' style='height: 25px;'> \
                                                      <img src='img/heater_closed.png' style='height: 22px; margin-left:10px;'> \
                                                      <img src='img/ac_closed.png' style='width: 27px; margin-left:10px;'> \
                                                    </div> \
                                                  </div> \
                                                </div> \
                                              </div>");
      
      
      $( "#reset_room_"  + room_nb.toString() ).click(function(evt) {
        var btn_id = evt.currentTarget.attributes[1].value;
        console.log( 'Reset to room ' + btn_id.replace('reset_room_', '') );
        $('#'+ btn_id).removeClass('btn-info');
        $('#'+ btn_id).addClass('btn-danger');
        setTimeout(function( ) {
          $('#'+ btn_id).removeClass('btn-danger');
          $('#'+ btn_id).addClass('btn-info');
        }, 5000);

        BMSGraphClient.facility.resetRoom( parseInt( btn_id.replace('reset_room_', '') ) ); 
      });

      $( "#set_temp_room_"  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('set_temp_room_', '');
        var temp_id = id.replace('set_temp_room_', 'temp_room_');
        var temp = parseInt($("#"+temp_id).val());
        
        $("#img_"+id).get(0).src = 'img/checked-active.png';

        if( hvac_option_selected == HVAC_OPTION.AC ) {
          if( temp > 16 && temp < 30) {
            setACUnitTemp( room_nb, temp );
          }
        }
        else { 
          var source_off = $('#heater_off_'  + room_nb).attr('src').includes("selected");
          var source_on = $('#heater_on_'  + room_nb).attr('src').includes("selected");
          var source_auto = $('#heater_auto_'  + room_nb).attr('src').includes("selected");
          // keep current heater option
          var heater_option;
          source_off ? heater_option = HEATER_GLOBAL_OPTION.OFF : ( source_on ? heater_option = HEATER_GLOBAL_OPTION.ON : heater_option = HEATER_GLOBAL_OPTION.AUTO );
          return BMSGraphClient.facility.setRoomIdleHeating( room_nb, heater_option, temp ).then( ( response ) => 
          {
              console.log( 'ROOM IDLE HEATING CHANGED', response );
          });
        }
        



        setTimeout(function( ) {
          $("#img_"+id).get(0).src = 'img/checked.png';
        }, 500);
      });

      $( "#ignore_window_input_"  + room_nb ).change(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('ignore_window_input_', '');
        //console.log(id, room_nb);
        if( $('#ignore_window_input_'+room_nb).is(":checked") ) {
          ignoreWindowRoom(room_nb, true);
        }
        else {
          ignoreWindowRoom(room_nb, false);
        }
        
      });

      $( "#ac_state_room_"  + room_nb ).change(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('ac_state_room_', '');
        //console.log(id, room_nb);
        if( $('#ac_state_room_' + room_nb).is(":checked") ) {
          setACUnitState(room_nb, true);
        }
        else {
          setACUnitState(room_nb, false);
        }
      });

      
      $( "#fan_speed_low_"  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('fan_speed_low_', '');
        $('#fan_speed_low_'  + room_nb).attr('src', 'img/fan_active.png');
        $('#fan_speed_medium_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_high_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_powerful_'  + room_nb).attr('src', 'img/fan.png');

        setACUnitFanSpeed(room_nb, 'low');

      });

      $( '#fan_speed_medium_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('fan_speed_medium_', '');
        $('#fan_speed_low_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_medium_'  + room_nb).attr('src', 'img/fan_active.png');
        $('#fan_speed_high_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_powerful_'  + room_nb).attr('src', 'img/fan.png');

        setACUnitFanSpeed(room_nb, 'medium');

      });

      $( '#fan_speed_high_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('fan_speed_high_', '');
        $('#fan_speed_low_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_medium_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_high_'  + room_nb).attr('src', 'img/fan_active.png');
        $('#fan_speed_powerful_'  + room_nb).attr('src', 'img/fan.png');

        setACUnitFanSpeed(room_nb, 'high');
        
      });
      
      $( '#fan_speed_powerful_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('fan_speed_powerful_', '');
        $('#fan_speed_low_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_medium_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_high_'  + room_nb).attr('src', 'img/fan.png');
        $('#fan_speed_powerful_'  + room_nb).attr('src', 'img/fan_active.png');

        setACUnitFanSpeed(room_nb, 'powerful');
        
      });

      $( '#heater_off_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('heater_off_', '');
        $('#heater_off_'  + room_nb).attr('src', 'img/heater_closed_selected.png');
        $('#heater_on_'  + room_nb).attr('src', 'img/heater_open.png');
        $('#heater_auto_'  + room_nb).attr('src', 'img/heater_auto.png');
        var setpoint = parseInt( $('#temp_room_'  + room_nb).val() );

        return BMSGraphClient.facility.setRoomIdleHeating( room_nb, HEATER_GLOBAL_OPTION.OFF, setpoint ).then( ( response ) => 
        {
            console.log( 'ROOM IDLE HEATING CHANGED', response );
        });

      });

      $( '#heater_on_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('heater_on_', '');
        $('#heater_off_'  + room_nb).attr('src', 'img/heater_closed.png');
        $('#heater_on_'  + room_nb).attr('src', 'img/heater_open_selected.png');
        $('#heater_auto_'  + room_nb).attr('src', 'img/heater_auto.png');

        var setpoint = parseInt( $('#temp_room_'  + room_nb).val() );
        console.log(">>>>>>>>SETPOINT for ", room_nb, " is ", setpoint);
        return BMSGraphClient.facility.setRoomIdleHeating( room_nb, HEATER_GLOBAL_OPTION.ON, setpoint ).then( ( response ) => 
        {
            console.log( 'ROOM IDLE HEATING CHANGED', response );
        });
        
      });

      $( '#heater_auto_'  + room_nb ).click(function(evt) {
        var id = evt.currentTarget.attributes[1].value;
        var room_nb = id.replace('heater_auto_', '');
        $('#heater_off_'  + room_nb).attr('src', 'img/heater_closed.png');
        $('#heater_on_'  + room_nb).attr('src', 'img/heater_open.png');
        $('#heater_auto_'  + room_nb).attr('src', 'img/heater_auto_selected.png');
        var setpoint = parseInt( $('#temp_room_'  + room_nb).val() );

        return BMSGraphClient.facility.setRoomIdleHeating( room_nb, HEATER_GLOBAL_OPTION.AUTO, setpoint ).then( ( response ) => 
        {
            console.log( 'ROOM IDLE HEATING CHANGED', response );
        });
        
      });
  }
}

  for (i = 2; i < 12; i++) {
    $('#floor-' + i.toString() +'-tag-text').text("Click to see all rooms");
  }
});

/*$('#clear_alert_modal').on('keypress', function (event) {
  console.log("BEFORE ENTER clicked");
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13') {
    $('#confirm_clear_alert').click(); 
  }
  //return event.preventDefault();  
});*/

$('#hvac_ac_cold').click( function() {
    $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_selected.png');
    $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_not_selected.png');
    $('#hvac_radiator').attr('src', 'img/hvac_radiator_not_selected.png');  

    $('#radiator_no_client_global_text').hide();
    $('#heater_option_icon_global').hide();

    hvac_option_selected = HVAC_OPTION.AC;
    updateRoomCardsWithHVACOption();

    return BMSGraphClient.facility.setOptions({
        hvacMode: 'ac_cooling' 
    }).then( function( facility ) 
    {
        console.log( 'FACILITY SET OPTIONS: ', facility.data ); 
    });
  
    
});

$('#hvac_radiator').click( function() {
  $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_not_selected.png');
  $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_not_selected.png');
  $('#hvac_radiator').attr('src', 'img/hvac_radiator_selected.png');

  $('#radiator_no_client_global_text').show();
  $('#heater_option_icon_global').show();

  hvac_option_selected = HVAC_OPTION.HEATER;
  updateRoomCardsWithHVACOption();

  return BMSGraphClient.facility.setOptions({
      hvacMode: 'rd_heating' 
  }).then( function( facility ) 
  {
      console.log( 'FACILITY SET OPTIONS: ', facility.data ); 
  });
   
});

$('#hvac_ac_hot').click( function() {
  $('#hvac_ac_cold').attr('src', 'img/hvac_ac_cold_not_selected.png');
  $('#hvac_ac_hot').attr('src', 'img/hvac_ac_hot_selected.png');
  $('#hvac_radiator').attr('src', 'img/hvac_radiator_not_selected.png');
  
  $('#radiator_no_client_global_text').hide();
  $('#heater_option_icon_global').hide();

  hvac_option_selected = HVAC_OPTION.AC;
  updateRoomCardsWithHVACOption();

  return BMSGraphClient.facility.setOptions({
      hvacMode: 'ac_heating' 
  }).then( function( facility ) 
  {
      console.log( 'FACILITY SET OPTIONS: ', facility.data ); 
  });
   
});

$('#heater_off_global').click( function() {
  $('#heater_off_global').attr('src', 'img/heater_closed_selected.png');
  $('#heater_on_global').attr('src', 'img/heater_open.png');
  $('#heater_auto_global').attr('src', 'img/heater_auto.png');

  heater_no_client_global_option = HEATER_GLOBAL_OPTION.OFF;
  updateHeaterOptionAllRooms( );
});

$('#heater_on_global').click( function() {
  $('#heater_off_global').attr('src', 'img/heater_closed.png');
  $('#heater_on_global').attr('src', 'img/heater_open_selected.png');
  $('#heater_auto_global').attr('src', 'img/heater_auto.png');

  heater_no_client_global_option = HEATER_GLOBAL_OPTION.ON;
  updateHeaterOptionAllRooms( );
});

$('#heater_auto_global').click( function() {
  $('#heater_off_global').attr('src', 'img/heater_closed.png');
  $('#heater_on_global').attr('src', 'img/heater_open.png');
  $('#heater_auto_global').attr('src', 'img/heater_auto_selected.png');

  heater_no_client_global_option = HEATER_GLOBAL_OPTION.AUTO;
  updateHeaterOptionAllRooms( );
  updateRoomsTemp( );
});

$('#turn_ac_on').click( function() {
  $('#turn_ac_on').attr('src', 'img/turn_on_off.png');

  setAllUnitsState(true);
  setTimeout(function( ) {
    $('#turn_ac_on').attr('src', 'img/turn_on.png');
  }, 1000);
   
});

$('#turn_ac_off').click( function() {
  $('#turn_ac_off').attr('src', 'img/turn_on_off.png');

  setAllUnitsState(false);
  setTimeout(function( ) {
    $('#turn_ac_off').attr('src', 'img/turn_off.png');
  }, 1000);
   
});

$( "#set_temp_global" ).click(function(evt) {
  $("#img_set_temp_global").get(0).src = 'img/checked-active.png';
  var temp = parseInt($("#temp_global").val());
  if( hvac_option_selected == HVAC_OPTION.AC )
    setAllUnitsTemp( temp );
  else {
      return BMSGraphClient.facility.setOptions( {
        idleHeatingSetpoint: temp
    });
  }

  setTimeout(function( ) {
    $("#img_set_temp_global").get(0).src = 'img/checked.png';
  }, 500);
});

$( '#fan_speed_low' ).click( ( evt ) => {
  $('#fan_speed_low').attr('src', 'img/fan_active.png');
  $('#fan_speed_medium').attr('src', 'img/fan.png');
  $('#fan_speed_high').attr('src', 'img/fan.png');
  $('#fan_speed_powerful').attr('src', 'img/fan.png');

  setAllUnitsFanSpeed( 'low' );
});

$( '#fan_speed_medium' ).click( ( evt ) => {
  $('#fan_speed_low').attr('src', 'img/fan.png');
  $('#fan_speed_medium').attr('src', 'img/fan_active.png');
  $('#fan_speed_high').attr('src', 'img/fan.png');
  $('#fan_speed_powerful').attr('src', 'img/fan.png');
  
  setAllUnitsFanSpeed( 'medium' );
});

$( '#fan_speed_high' ).click( ( evt ) => {
  $('#fan_speed_low').attr('src', 'img/fan.png');
  $('#fan_speed_medium').attr('src', 'img/fan.png');
  $('#fan_speed_high').attr('src', 'img/fan_active.png');
  $('#fan_speed_powerful').attr('src', 'img/fan.png');

  setAllUnitsFanSpeed( 'high' );
});

$( '#fan_speed_powerful' ).click( ( evt ) => {
  $('#fan_speed_low').attr('src', 'img/fan.png');
  $('#fan_speed_medium').attr('src', 'img/fan.png');
  $('#fan_speed_high').attr('src', 'img/fan.png');
  $('#fan_speed_powerful').attr('src', 'img/fan_active.png');

  setAllUnitsFanSpeed( 'powerful' );
});
    


$(document).on('click', '.navbar-toggler', function() {
  $toggle = $(this);

  if (mobile_menu_visible == 1) {
    $('html').removeClass('nav-open');

    $('.close-layer').remove();
    setTimeout(function() {
      $toggle.removeClass('toggled');
    }, 400);

    mobile_menu_visible = 0;
  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 430);

    var $layer = $('<div class="close-layer"></div>');

    if ($('body').find('.main-panel').length != 0) {
      $layer.appendTo(".main-panel");

    } else if (($('body').hasClass('off-canvas-sidebar'))) {
      $layer.appendTo(".wrapper-full-page");
    }

    setTimeout(function() {
      $layer.addClass('visible');
    }, 100);

    $layer.click(function() {
      $('html').removeClass('nav-open');
      mobile_menu_visible = 0;

      $layer.removeClass('visible');

      setTimeout(function() {
        $layer.remove();
        $toggle.removeClass('toggled');

      }, 400);
    });

    $('html').addClass('nav-open');
    mobile_menu_visible = 1;

  }

});


function setAllUnitsTemp( globalTemp )
{
    return BMSGraphClient.facility.setOptions({ 
        acTemperature: globalTemp
    }).then( ( d ) => { console.log( 'ALL UNITS TEMP: ', d ) } );
}

function setAllUnitsState( state ) // state can be true - on or false - off
{
    return BMSGraphClient.facility.ac.setAllUnits({ 
        active: state
    });
}

function setAllUnitsFanSpeed( fan_speed ) // state can be true - on or false - off
{
    return BMSGraphClient.facility.setOptions({
      acFanSpeed: fan_speed
    }).then( function( facility ) 
    {
        console.log( 'FACILITY SET OPTIONS: ', facility.data ); 
    });
}

function setACUnitTemp( room, temp )
{   
    return BMSGraphClient.facility.ac.setUnit( room, {
        setpointTemperature: temp
    }).then( ( d ) => { console.log( 'SET AC TEMP: ', d ) } );
}

function setACUnitFanSpeed( room, fan_speed )
{   
    return BMSGraphClient.facility.ac.setUnit( room, {
      fan: fan_speed
    }).then( ( d ) => { console.log( 'SET AC FAN SPEED: ', d ) } );
}

function setACUnitState( room, state )
{   
    return BMSGraphClient.facility.ac.setUnit( room, {
        active: state
    }).then( ( d ) => { console.log( 'SET AC STATE: ', d ) } );
}

function ignoreWindowRoom( room, state )
{   
    return BMSGraphClient.facility.setRoomWindowIgnore( room, state ).then( ( d ) => { console.log( 'IGNORE WINDOW ROOM: ', d ) } );
}

function getACUnit( room )
{   
    return BMSGraphClient.facility.ac.getUnit( room ).then( function( ac_unit_data ) 
    {
        console.log( 'GOT AC UNIT', ac_unit_data.data ); 
    });
}


/*function getActiveAlerts(  )
{
    // create new account
    return BMSGraphClient.alerts.getActiveAlerts( ).then( ( response ) => 
    {
        console.log( 'GET ACTIVE ALERTS', response );
        var eventDescription;

        response.data.forEach(function (item, index) {
          if( item.event == 'wc_exploded' ){
            eventDescription = 'Bathroom FLOOD';
          }
          else if( item.event == 'flood' ){
            eventDescription = 'Bathroom FLOOD';
          }
          else if( item.event == 'sos' ){
            eventDescription = 'SOS signalled';
          }
          else if( item.event == 'window' ){
            eventDescription = 'Window OPEN';
          }

          eventDescription = eventDescription + ' on room ' + item.room + ', floor ' + parseInt(item.room/100);
          console.log(eventDescription);

          alert_displayed = 0;
          if( alertsEventsArray ) {
           for ( var key in alertsEventsArray ) {
              if( (key == item.id && alertsEventsArray[key] == item.event && alertsRoomsArray[key] == item.room) )//|| (alertsEventsArray[key] == item.event && alertsRoomsArray[key] == item.room) )
                alert_displayed = 1;
            }
            if( alert_displayed == 0 ) {
              md.showAlertNotification('top','center', eventDescription, item.id, item.room, item.event );
              alertsEventsArray[item.id] = item.event;
              alertsRoomsArray[item.id] = item.room;
            }
          }
          else {
            md.showAlertNotification('top','center', eventDescription, item.id, item.room, item.event );
            alertsEventsArray[item.id] = item.event;
            alertsRoomsArray[item.id] = item.room;
          }
        });

    });
}


var activeAlertsInterval = setInterval(getActiveAlerts, 15000);*/

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

