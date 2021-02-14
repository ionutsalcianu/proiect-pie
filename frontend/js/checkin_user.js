var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
  mobile_menu_initialized = false,
  toggle_initialized = false,
  bootstrap_nav_initialized = false;

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;

$(document).ready(function() {

  $('body').bootstrapMaterialDesign();

  $sidebar = $('.sidebar');

  window_width = $(window).width();

  // check if there is an image set for the sidebar's background
  md.checkSidebarImage();

  // set endpoint, remote or local
  window.BMSGraphClient = BMSGraph.use( 'http://localhost/graphql' );
  window.NFCAccessClient = NFCAccess.use( 'ws://localhost:8084' );

  function logout(){
    // check if user is logged in
    BMSGraphClient.account.isAuthorized().then( ( status ) => 
    {
        console.log( 'AUTHORIZED', status );
        console.log( 'SIGN OUT' );
        BMSGraphClient.account.logout( );
        window.location = "template.html";
    });
    
  }
  
  $('#logout').click( ( evt ) => {
    logout();
  });
  
});
    

function check_password( notification ) 
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

 
}



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

// activate collapse right menu when the windows is resized
$(window).resize(function() {
  md.initSidebarsCheck();

});

md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  },

  checkSidebarImage: function() {
    $sidebar = $('.sidebar');
    image_src = $sidebar.data('image');

    if (image_src !== undefined) {
      sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>';
      $sidebar.append(sidebar_container);
    }
  },

  showNotification: function(from, align, show_message) {
    type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    color = 2;//Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "add_alert",
      message: show_message

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  },

  showAlertNotification: function(from, align, show_message) {
    type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    color = 2;//Math.floor((Math.random() * 6) + 1);
    
    if( BMSGraphClient.account.getUserData().role == 2)
      var alert_notification = alert_notification_staff;
    else
      var alert_notification = alert_notification_admin;

    var alert_notification_object = $.notify({
      message: alert_notification

    }, {
      type: type[color],
      timer: 0,
      placement: {
        from: from,
        align: align
      }
    });

    $( '#clear_notification' ).click( ( evt ) => {
      //check_password( notification );
      $( '#login_modal' ).modal();
      $( '#confirm_action' ).click( ( evt ) => {
        check_password( alert_notification_object );
        return evt.preventDefault();
      });
      return evt.preventDefault();
    });

    $( '#snooze_notification' ).click( ( evt ) => {
      alert_notification_object.close();
      setTimeout( () => {
        md.showAlertNotification('top','center', '');
        
    }, 120000 );
      return evt.preventDefault();
    });

  },

  showLoginPopup: function(from, align, show_message) {
    type = ['', 'info', 'danger', 'success', 'warning', 'rose', 'primary'];

    color = 2;//Math.floor((Math.random() * 6) + 1);

    var notification = $.notify({
      message: popup_login_content

    }, {
      type: type[color],
      timer: 0,
      placement: {
        from: from,
        align: align
      }
    });

    
  },

  initSidebarsCheck: function() {
    if ($(window).width() <= 991) {
      if ($sidebar.length != 0) {
        md.initRightMenu();
      }
    }
  },

  checkFullPageBackgroundImage: function() {
    $page = $('.full-page');
    image_src = $page.data('image');

    if (image_src !== undefined) {
      image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  },

  initMinimizeSidebar: function() {

    $('#minimizeSidebar').click(function() {
      var $btn = $(this);

      if (md.misc.sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        md.misc.sidebar_mini_active = false;
      } else {
        $('body').addClass('sidebar-mini');
        md.misc.sidebar_mini_active = true;
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function() {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  },

  checkScrollForTransparentNavbar: debounce(function() {
    if ($(document).scrollTop() > 260) {
      if (transparent) {
        transparent = false;
        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
      }
    } else {
      if (!transparent) {
        transparent = true;
        $('.navbar-color-on-scroll').addClass('navbar-transparent');
      }
    }
  }, 17),


  initRightMenu: debounce(function() {
    $sidebar_wrapper = $('.sidebar-wrapper');

    if (!mobile_menu_initialized) {
      $navbar = $('nav').find('.navbar-collapse').children('.navbar-nav');

      mobile_menu_content = '';

      nav_content = $navbar.html();

      nav_content = '<ul class="nav navbar-nav nav-mobile-menu">' + nav_content + '</ul>';

      navbar_form = $('nav').find('.navbar-form').get(0).outerHTML;

      $sidebar_nav = $sidebar_wrapper.find(' > .nav');

      // insert the navbar form before the sidebar list
      $nav_content = $(nav_content);
      $navbar_form = $(navbar_form);
      $nav_content.insertBefore($sidebar_nav);
      $navbar_form.insertBefore($nav_content);

      $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
        event.stopPropagation();

      });

      // simulate resize so all the charts/maps will be redrawn
      window.dispatchEvent(new Event('resize'));

      mobile_menu_initialized = true;
    } else {
      if ($(window).width() > 991) {
        // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
        $sidebar_wrapper.find('.navbar-form').remove();
        $sidebar_wrapper.find('.nav-mobile-menu').remove();

        mobile_menu_initialized = false;
      }
    }
  }, 200)
}

$(".close").click(function(){
  console.log("Notification Closed");
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
