// NFC Access card API interface
( function( window, ndef )
{
    // API
    var _ = {
        state: 
        {
            timeout: 5000,
            refresh_timeout: 1000,
            ready: false,
            wscn: false,
            url: 'ws://0.0.0.0:8084'
        },
        
        // start API connection
        use: function( url )
        {
            _.state.url = url;
            _.attempt();

            return _;
        }, 

        attempt: function(  )
        {
            _.state.wscn = new WebSocket( _.state.url );

            _.state.wscn.onerror = _.handlers.error;
            _.state.wscn.onclose = _.handlers.close;
            _.state.wscn.onopen = function( ) 
            {
                _.state.wscn.ready = true;
                _.state.wscn.onmessage = _.handlers.message;
            };
        },

        handlers: {
            close: function( e )
            {
                _.state.wscn.onmessage = function(){};
                _.state.wscn.ready = false;
                console.error( 'RFID Socket closed, refreshing the page ...' );
                setTimeout( function( ) { 
                    window.location.reload();
                }, _.state.refresh_timeout );
            },
            error: function( e )
            {
                _.state.wscn.onmessage = function(){};
                _.state.wscn.ready = false;
                console.error( 'RFID Service Unavailable, retrying...' );
                setTimeout( _.attempt, _.state.timeout );
            },
            message: function( reply )
            {
                var data = JSON.parse( reply.data );

                // dispatch as card events
                if( data.event == 'enter' || data.event == 'exit' )
                {
                    var evt = new CustomEvent( data.event, { detail: data.data } );
                    _.card.dispatchEvent( evt );
                }

                // run programming callback
                if( data.event == 'program' ) _.state.programCallback( data );
            }
        },

        card: document.createElement( 'div' ),

        program: function( data, fn ) 
        {
            if( data.hasOwnProperty( 'expiration' ) )
            {
                data.expiration = (( typeof data.expiration == 'object' ) ? data.expiration.getTime() : data.expiration ).toString();
            }
             
            _.state.wscn.send( JSON.stringify( { command: 'program', data: data } ));
            _.state.programCallback = function( reply )
            {
                fn( reply ); 
                _.state.programCallback = function(){};
            };
        }
    };

    // expose API
    window.NFCAccess = _;

})( window );  
