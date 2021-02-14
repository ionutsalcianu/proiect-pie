

var mobile_menu_visible = 0,
    mobile_menu_initialized = false,
    toggle_initialized = false,
    bootstrap_nav_initialized = false;

$('#logout').click( ( evt ) => {
  logout();
});

function logout(){
  // check if user is logged in

      console.log( 'AUTHORIZED', status );
      console.log( 'SIGN OUT' );
	  sessionStorage.clear();
     // BMSGraphClient.account.logout( );
      window.location = "login.html";
  
}



$(document).ready(function() {
  isLogged();
  isAdmin();
  //$('#number_of_alerts').hide();
  //window.BMSGraphClient = BMSGraph.use( 'http://localhost/graphql' );
  
  getUserDetails( );
  $('#username_display').html('User: <br>' + window.username );
  $('#alerts-button').click(function(){getUserDetails( );});
  


});

function isLogged(){
	if(sessionStorage.getItem("customerId")==null && (window.location.href.split("/")[4] != "login.html" && window.location.href.split("/")[4] != "register.html")){
		window.location="login.html";
	}
}

function isAdmin(){
	if (sessionStorage.getItem("userType") != "admin") {
		$("#admin_tab").css("display","none");
	}
}


function getUserDetails()
{
	window.username=sessionStorage.getItem("firstName");
	 $.ajax({
            url: "http://localhost:8123/api/v1/customer-controller/customer-active-coupons",
            type: "GET",
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic " + btoa( "api-user:admin" ));
				},
            data:{'customerId':sessionStorage.getItem("customerId")},
            success: function(result) {
				$('#alerts-a').text('You have '+result+ ' active coupons');
				$("#number_of_alerts").text(result);
            }
         })
}
  
function check_password( notification ) 
{
  var username = BMSGraphClient.account.getUserData().username;
  var pass = $("#login_modal_password").val();
  // get token for some credentials and set the token
  /*BMSGraphClient.account.login( username, pass ).then( ( response ) => 
  { 
      // check success or fail
      if( response.success ) 
      {
          // may use this token for some specific requests
          BMSGraphClient.account.useToken( response.data.token );

          // save token in client persistent storage 
          BMSGraphClient.account.saveToken( response.data.token );

          console.log( 'Password check success!' );
          if( window.current_notification_to_close_id ) {	
            updateAlert( window.current_notification_to_close_id, 3 );	
            //console.log( ">>>>>>>>>NOTIFICATION: ", notification );	
            notification.close();	
            window.current_notification_to_close_id = null;	
          }	
          $("#login_modal_password").val("");
          return false;
      }
      // failed, display massage if any
      else
      {
          console.log( 'Password not ok!' );
          $("#alert_modal").modal();
          $("#close_modal").click( ( evt ) => {
            $("#popup_password").val("")
            $("#login_modal").modal();
          });
          
      }
 }, ( err ) => {
  console.log( 'NUUUUUUUU', err );
 });*/
}


// activate collapse right menu when the windows is resized
$(window).resize(function() {
  md.initSidebarsCheck();

  // reset the seq for charts drawing animations
  seq = seq2 = 0;
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

