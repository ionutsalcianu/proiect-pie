// graphQL BMS Query interface
( function( window, ndef )
{
    // Graph query properties to be returned
    var GraphProps = {
        available: [ 'available' ],
        login: [ 'token', 'username', 'name', 'role' ],
        verify: [ 'username', 'name', 'role' ],
        room: [ 'id', 'number', 'description', 'season', 'ignore', 'ac', 'acTemperature', 'acHeat', 'acError', 'idleHeating', 'idleHeatingSetpoint' ],
        roomevent: [ 'state', 'timestamp', 'temperature', 'window', 'sos', 'flood', 'thermo', 'ignore', 'issues', 'idle_mode', 'idle_setpoint' ],
        client: [ 'id', 'identifier', 'name', 'checkin', 'checkout', 'room' ],
        employee: [ 'id', 'identifier', 'name', 'room' ],
        alert: [ 'id', 'timestamp', 'room', 'event', 'state' ],
        ac: [ 'disabled', 'active', 'mode', 'setpointTemperature', 'fan', 'rcLock', 'roomTemperature', 'errorCode' ],
        facility: [ 'season', 'acMode', 'acFanSpeed', 'acTemperature', 'acHeat', 'hvacMode', 'idleHeating', 'idleHeatingSetpoint' ],
        access: [ 'room', 'identifier', 'timestamp', 'event', 'role', 'room', 'name' ]
    };

    // room state map
    var RoomState = {
        enum: [ 'unknown', 'free', 'occupied', 'dnd', 'clean' ],
        map: function( evt ) 
        {
            if( evt != null && evt.hasOwnProperty( 'state' ) )
            {
                var state = parseInt( evt.state );

                if( state >= 0 && state < RoomState.enum.length ) evt.state = RoomState.enum[ state ];
                else evt.state = RoomState.enum[ 0 ];
            }
            return evt;
        },
        unmap: function( evt )
        {
            if( evt != null && evt.hasOwnProperty( 'state' ) )
            {
                var state = RoomState.enum.indexOf( evt.state );

                if( state < 0 ) evt.state = 0;
                else evt.state = state;
            } 
            return evt;
        }
    };

    // private
    var _ = {
        state: {
            available: false,
            endpoint: '',
            authToken: localStorage.getItem( 'BMSAuthToken' ),
            poll_interval: false
        },

        // use specific endpoint
        use: function( endpoint )
        {
            _.state.endpoint = endpoint;

            if( _.state.poll_interval != false ) clearInterval( _.state.poll_interval );
            _.state.poll_interval = setInterval( _.poll_endpoint, 2500 );
            _.poll_endpoint();

            return _;
        },

        poll_endpoint: function( )
        {
            var query = 'query{ available { ' + GraphProps.available.join( ',' ) + ' } }';
            var _take = false;

            //console.log( 'GraphService', _.state.available )

            return Promise.race( [
                new Promise( ( reject, resolve ) => 
                {
                    setTimeout( () =>
                    {
                        if( !_take ) 
                        {
                            _.state.available = false;
                            _take = true;
                            resolve();
                        }                        
                    }, 2000 );
                }).then( 
                    ( d ) => { return d; }, 
                    ( e ) => { return e; } 
                ),

                // fetch availability state
                fetch( _.state.endpoint, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/graphql',
                        'Authorization': 'Bearer unauthorized' 
                    },
                    body: query
                }).then( ( response ) => 
                { 
                    if( !_take )
                    {
                        _.state.available = true;
                        _take = true;    
                    }
                }, 
                ( e ) => 
                { 
                    if( !_take )
                    {
                        _.state.available = false;
                        _take = true;    
                    }                   
                })
            ]);
        },

        // query graph
        query: function( token, data )
        {
            return fetch( _.state.endpoint, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/graphql',
                    'Authorization': 'Bearer ' + token 
                },
                body: data
            } ).then( ( response ) => { return response.json() } );
        },

        
        // login and logout functions
        account: {
            hasToken: function(  )
            {
                _.state.authToken = localStorage.getItem( 'BMSAuthToken' );
                
                return !!( _.state.authToken !== null && _.state.authToken );
            },

            isAuthorized: function( )
            {
                if( ! _.account.hasToken() ) return Promise.resolve( false );
                var query = 'query{ verify( token: "' + _.state.authToken + '" ) { ' + GraphProps.verify.join( ',' ) + ' } }';

                // return promise
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {  
                    if( response.data.verify === null )
                    {
                        return false;
                    }
                    else 
                    {
                        // otherwise, return user data
                        var userdata = response.data.verify;

                        return {
                            name: userdata.name,
                            username: userdata.username,
                            role: userdata.role
                        };
                    }
                }, ( err ) => {
                    return false;
                });
            },

            login: function( identity, password )
            {
                var query = 'query { login( identity: "' + identity + '", password: "' + password + '" ) { ' + GraphProps.login.join( ',' ) + ' } }';
 
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: { token: null, errors: response.errors[ 0 ] } };
                    }

                    if( response.data.hasOwnProperty( 'login' ) )
                    {
                        if( response.data.login.hasOwnProperty( 'token' ) )
                        {   
                            if( !! response.data.login.token )
                            {
                                return { success: true, data: response.data.login };
                            }
                        }
                    }
                    return { success: false, data: { token: null, errors: response.data } };
                }, ( err ) => {
                    return { success: false, data: { token: null, errors: err } };
                });
            },

            // use token for some requests
            useToken: function( token )
            {
                _.state.authToken = token;
            },

            // save and use token
            saveToken: function( token )
            {
                _.state.authToken = token;
                localStorage.setItem( 'BMSAuthToken', token );
            },

            // get token
            getToken: function( )
            {
                return _.state.authToken;
            },
            
            // get user data
            getUserData: function(  )
            {
                var userdata = localStorage.getItem( 'BMSAuthUser' );
                return ( userdata === null ) ? false : JSON.parse( userdata );
            },

            // save user data
            setUserData: function( userdata )
            {
                localStorage.setItem( 'BMSAuthUser', JSON.stringify( userdata ) );
            },

            // logout user
            logout: function(  )
            {
                _.state.authToken = null;
                localStorage.removeItem( 'BMSAuthToken' );
                localStorage.removeItem( 'BMSAuthUser' );
            },

            // create account, requires at least manager role token
            create: function( username, name, email, password, role )
            {
                var query = 'mutation { create_user( username: "' + username + '", name: "' + name + '", email: "' + email + '", password: "' + password + '", role: ' + ( parseInt( role ) || 2 ) + ' ) { username }}';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: { token: null, errors: response.errors[ 0 ] } };
                    }

                    if( response.data.hasOwnProperty( 'create_user' ) )
                    {
                        if( response.data.create_user.hasOwnProperty( 'username' ) )
                        {   
                            if( !! response.data.create_user.username )
                            {
                                return { success: true, data: { username: response.data.create_user.username } };
                            }
                        }
                    }

                    return { success: false, data: { username: null, errors: response.data } };
                    
                }, ( err ) => {
                    return { success: false, data: { username: null, errors: err } };
                });
            }
        },

        // room queries
        facility: {
            // get all rooms
            getRoomList: function()
            {
                var query = 'query{ get_facility_rooms }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [] };
                    }

                    if( response.data.hasOwnProperty( 'get_facility_rooms' ) )
                    {
                        return { 
                            success: true, 
                            data: response.data.get_facility_rooms
                        };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });           
            },

            // get all facility options
            getOptions: function(  )
            {
                var query = 'query{ get_facility { ' + GraphProps.facility.join( ',' ) + ' } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [] };
                    }

                    if( response.data.hasOwnProperty( 'get_facility' ) )
                    {
                        return { 
                            success: true, 
                            data: response.data.get_facility
                        };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            setOptions: function( settings )
            {
                var options = Object.keys( settings )
                    .map( ( k ) => { return k + ':' + (( typeof settings[ k ] == 'string' ) ? ( '"' + settings[ k ] + '"' ) : settings[ k ] ) });

                var query = 'mutation { set_facility( ' + options.join( ', ' ) + ' ) { ' + GraphProps.facility.join( ', ' ) + ' } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'set_facility' ) )
                    {
                        return { success: true, data: response.data.set_facility };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get all rooms along their most recent state
            getRooms: function(  )
            {
                var query = 'query{ rooms { ' + GraphProps.room.join( ',' ) + ', state { ' + GraphProps.roomevent.join( ',' ) + ' } } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [] };
                    }

                    if( response.data.hasOwnProperty( 'rooms' ) )
                    {
                        return { 
                            success: true, 
                            data: response.data.rooms.map( ( room ) => {
                                room.state = RoomState.map( room.state );
                                return room;
                            })
                        };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // create room
            createRoom: function( number, description )
            {
                var query = 'mutation { create_room( number: ' + parseInt( number ) + ', description: "' + description + '" ) { id, number, description, state { state } } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'create_room' ) )
                    {
                        return { success: true, data: response.data.create_room };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // returns room event list
            getRoomEvents: function( number )
            {
                var query = 'query { events( room: ' + parseInt( number ) + ' ) { ' + GraphProps.roomevent.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'events' ) )
                    {
                        return { success: true, data: response.data.events.map( RoomState.map ) };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                }); 
            },

            resetRoom: function( number )
            {
                var query = 'mutation { reset_room( room: ' + parseInt( number ) + ' ) }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'reset_room' ) )
                    {
                        return { success: true, data: response.data.reset_room };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                }); 
            },

            // set room window ignore
            setRoomWindowIgnore: function( number, ignore )
            {
                var query = 'mutation { set_room_ignore_window( room: ' + parseInt( number ) + ', ignore: ' + ( !! ignore ) + ' ) }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'set_room_ignore_window' ) )
                    {
                        return { success: true, data: response.data.set_room_ignore_window };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                }); 
            },  

            // set individual room season
            setRoomSeason: function( number, season )
            {
                var query = 'mutation { set_room_season( room: ' + parseInt( number ) + ', season: ' + ( !! season ) + ' ) }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'set_room_season' ) )
                    {
                        return { success: true, data: response.data.set_room_season };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                }); 
            },

            // set individual room idle heating mode
            // 0 - heating on in idle
            // 1 - heating off in idle
            // 2 - temperature control at the provided setpoint 
            setRoomIdleHeating: function( number, mode, setpoint )
            {
                var query = 'mutation { set_room_idle_heating( room: ' + parseInt( number ) + ', idleHeating: ' + mode + ', idleHeatingSetpoint: ' + setpoint + ' ) }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'set_room_idle_heating' ) )
                    {
                        return { success: true, data: response.data.set_room_idle_heating };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                }); 
            },

            ac: {
                getUnit: function( room )
                {
                    var query = 'query{ get_ac_unit( room: ' + parseInt( room ) + ' ) { ' + GraphProps.ac.join( ',' ) + ' } }';

                    return _.query( _.state.authToken, query ).then( ( response ) => 
                    {
                        if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                        {
                            return { success: false, data: [] };
                        }

                        if( response.data.hasOwnProperty( 'get_ac_unit' ) )
                        {
                            return {
                                success: true,
                                data: response.data.get_ac_unit
                            };
                        }

                        return { success: false, data: [] };
                    }, ( err ) => {
                        return { success: false, data: [] };
                    });
                },

                setUnit: function( room, settings )
                {
                    var options = Object.keys( settings )
                        .filter( ( k ) => { return ( GraphProps.ac.indexOf( k ) >= 0 ) } )
                        .map( ( k ) => { return k + ':' + (( typeof settings[ k ] == 'string' ) ? ( '"' + settings[ k ] + '"' ) : settings[ k ] ) });

                    var query = 'mutation { set_ac_unit( room: ' + parseInt( room ) + ', ' + options.join( ', ' ) + ' ) { ' + GraphProps.ac.join( ', ' ) + ' } }';

                    return _.query( _.state.authToken, query ).then( ( response ) => 
                    {
                        if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                        {
                            return { success: false, data: [], error: response.errors[ 0 ].message };
                        }

                        if( response.data.hasOwnProperty( 'set_ac_unit' ) )
                        {
                            return { success: true, data: response.data.set_ac_unit };
                        }

                        return { success: false, data: [] };
                    }, ( err ) => {
                        return { success: false, data: [] };
                    });
                },

                setAllUnits: function( settings )
                {
                    var options = Object.keys( settings )
                        .filter( ( k ) => { return ( GraphProps.ac.indexOf( k ) >= 0 ) } )
                        .map( ( k ) => { return k + ':' + (( typeof settings[ k ] == 'string' ) ? ( '"' + settings[ k ] + '"' ) : settings[ k ] ) });

                    var query = 'mutation { set_all_ac_units( ' + options.join( ', ' ) + ' ) }';

                    return _.query( _.state.authToken, query ).then( ( response ) => 
                    {
                        if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                        {
                            return { success: false, data: [], error: response.errors[ 0 ].message };
                        }

                        if( response.data.hasOwnProperty( 'set_all_ac_units' ) )
                        {
                            return { success: true, data: response.data.set_all_ac_units };
                        }

                        return { success: false, data: [] };
                    }, ( err ) => {
                        return { success: false, data: [] };
                    });
                }
            }
        },

        // client queries
        clients: {
            // creates a new client
            createClient: function( room, name, checkout, checkin )
            {
                // verify checkout/checkin
                checkout = (( typeof checkout == 'object' ) ? checkout.getTime() : checkout ).toString();
                checkin = ( !! checkin ) ? (( typeof checkin == 'object' ) ? checkin.getTime() : checkin ) : Date.now();
                checkin = parseInt( checkin ).toString();

                var query = 'mutation { create_client( room: ' + parseInt( room ) + ', name: "' + name + '", checkin: "' + checkin + '", checkout: "' + checkout + '"  ) { ' + GraphProps.client.join( ',' ) + ' } }';
                
                // spoof client identifier
                if( ! _.state.available )
                {
                    return Promise.resolve({
                        success: true, 
                        data: {
                            id: null,
                            identifier: parseInt( Date.now() / 1000 ) % 0x0FFFFFFF,
                            name: "",
                            checkin: checkin,
                            checkout: checkout,
                            room: room
                        }
                    });
                }

                // traditional query
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'create_client' ) )
                    {
                        return { success: true, data: response.data.create_client };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get client by identifier
            getClient: function( identifier )
            {
                var query = 'query { client( identifier: ' + parseInt( identifier ) + ' ) { ' + GraphProps.client.join( ',' ) + ' } }';
                
                if( ! _.state.available )
                {
                    return Promise.resolve( { 
                        success: true, 
                        data: {
                            id: null,
                            identifier: parseInt( Date.now() / 1000 ) % 0x0FFFFFFF,
                            name: "",
                            checkin: new Date(),
                            checkout: new Date(),
                            room: [ 0 ]
                        }
                    });
                }

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'client' ) )
                    {
                        if( response.data.client.hasOwnProperty( 'checkin' ) ) response.data.client.checkin = new Date( parseInt( response.data.client.checkin ) );
                        if( response.data.client.hasOwnProperty( 'checkout' ) ) response.data.client.checkout = new Date( parseInt( response.data.client.checkout ) );
                        
                        return { success: true, data: response.data.client };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get all clients
            getClients: function( )
            {
                var query = 'query { clients { ' + GraphProps.client.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'clients' ) )
                    {
                        // map checkin/checkout to date objects
                        response.data.clients = response.data.clients.map( ( client ) => 
                        {
                            if( client.hasOwnProperty( 'checkin' ) ) client.checkin = new Date( parseInt( client.checkin ) );
                            if( client.hasOwnProperty( 'checkout' ) ) client.checkout = new Date( parseInt( client.checkout ) );
                            return client;
                        });
                        
                        return { success: true, data: response.data.clients };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // update client by identifier
            updateClient: function( identifier, update )
            {
                var update_props = "";
                
                // add properties
                if( update.hasOwnProperty( 'room' ) ) update_props += ', room: ' + parseInt( update.room );
                if( update.hasOwnProperty( 'name' ) ) update_props += ', name: "' + update.name + '"';
                // verify and add checkout/checkin
                if( update.hasOwnProperty( 'checkout' ) ) 
                {
                    update.checkout = (( typeof update.checkout == 'object' ) ? update.checkout.getTime() : update.checkout ).toString();
                    update_props += ', checkout: "' + update.checkout + '"';
                }
                if( update.hasOwnProperty( 'checkin' ) )
                {
                    update.checkin = ( !! update.checkin ) ? (( typeof update.checkin == 'object' ) ? update.checkin.getTime() : update.checkin ).toString() : ( Date.now() ).toString();
                    update_props += ', checkin: "' + update.checkin + '"';
                } 

                var query = 'mutation { update_client( identifier: ' + parseInt( identifier ) + update_props + ' ) { ' + GraphProps.client.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'update_client' ) )
                    {
                        if( response.data.update_client.hasOwnProperty( 'checkin' ) ) response.data.update_client.checkin = new Date( parseInt( response.data.update_client.checkin ) );
                        if( response.data.update_client.hasOwnProperty( 'checkout' ) ) response.data.update_client.checkout = new Date( parseInt( response.data.update_client.checkout ) );
                        
                        return { success: true, data: response.data.update_client };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            }
        },

        // employees queries
        employees: {
            // creates a new employee
            createEmployee: function( name, rooms )
            {
                var query = 'mutation { create_employee( name: "' + name + '", room: [' + ( rooms || [] ).join( ',' ) + '] ) { ' + GraphProps.employee.join( ',' ) + ' } }';
                
                // spoof employee identifier
                if( ! _.state.available )
                {
                    return Promise.resolve({
                        success: true, 
                        data: {
                            id: null,
                            identifier: parseInt( Date.now() / 1000 ) % 0x0FFFFFFF,
                            name: "",
                            room: []
                        }
                    });
                }

                // traditional query
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'create_employee' ) )
                    {
                        return { success: true, data: response.data.create_employee };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get employee by identifier
            getEmployee: function( identifier )
            {
                var query = 'query { employee( identifier: ' + parseInt( identifier ) + ' ) { ' + GraphProps.employee.join( ',' ) + ' } }';
                
                if( ! _.state.available )
                {
                    return Promise.resolve( { 
                        success: true, 
                        data: {
                            id: null,
                            identifier: parseInt( Date.now() / 1000 ) % 0x0FFFFFFF,
                            name: "",
                            room: [ 0 ]
                        }
                    });
                }

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'employee' ) )
                    {
                        
                        return { success: true, data: response.data.employee };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get all employees
            getEmployees: function( )
            {
                var query = 'query { employees { ' + GraphProps.employee.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'employees' ) )
                    {
                        // map checkin/checkout to date objects
                        response.data.employees = response.data.employees.map( ( employee ) => 
                        {
                            return employee;
                        });
                        
                        return { success: true, data: response.data.employees };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // update employee by identifier
            updateEmployee: function( identifier, update )
            {
                var update_props = "";
                var all_rooms = [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 201, 802, 803, 804, 805, 806, 807, 808, 809, 810, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010];
                
                // add properties
                if( update.hasOwnProperty( 'room' ) ) update_props += ', room: ' + all_rooms;
                if( update.hasOwnProperty( 'name' ) ) update_props += ', name: "' + update.name + '"';
                

                var query = 'mutation { update_employee( identifier: ' + parseInt( identifier ) + update_props + ' ) { ' + GraphProps.employee.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'update_employee' ) )
                    {
                        
                        return { success: true, data: response.data.update_employee };
                    }
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            }
        },

        alerts: 
        {
            // get all alerts
            getAlerts: function( )
            {
                var query = 'query { alerts { ' + GraphProps.alert.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {   
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'alerts' ) )
                    {   
                        // transform from String timestamp to Date object
                        response.data.alerts = response.data.alerts.map( ( alert ) => 
                        {
                            if( alert.hasOwnProperty( 'timestamp' ) ) alert.timestamp = new Date( parseInt( alert.timestamp ) );
                            return alert;
                        });

                        return { success: true, data: response.data.alerts };
                    }   
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // get active alerts
            getActiveAlerts: function( )
            {
                var query = 'query { active_alerts { ' + GraphProps.alert.join( ',' ) + ' } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {   
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'active_alerts' ) )
                    {   
                        // transform from String timestamp to Date object
                        response.data.active_alerts = response.data.active_alerts.map( ( alert ) => 
                        {
                            if( alert.hasOwnProperty( 'timestamp' ) ) alert.timestamp = new Date( parseInt( alert.timestamp ) );
                            return alert;
                        });

                        return { success: true, data: response.data.active_alerts };
                    }   
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // creates a new client
            createAlert: function( room, event )
            {
                var query = 'mutation { create_alert( room: ' + parseInt( room ) + ', event: "' + event + '"  ) { ' + GraphProps.alert.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'create_alert' ) )
                    {
                        if( response.data.create_alert.hasOwnProperty( 'timestamp' ) ) response.data.create_alert.timestamp = new Date( parseInt( response.data.create_alert.timestamp ) );
                        return { success: true, data: response.data.create_alert };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

            // update alert query
            updateAlert: function( id, state )
            {
                var query = 'mutation { update_alert( id: "' + id + '", state: ' + parseInt( state ) + ' ) { ' + GraphProps.alert.join( ',' ) + ' } }';
                
                return _.query( _.state.authToken, query ).then( ( response ) => 
                {
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'update_alert' ) )
                    {
                        if( response.data.update_alert.hasOwnProperty( 'timestamp' ) ) response.data.update_alert.timestamp = new Date( parseInt( response.data.update_alert.timestamp ) );
                        return { success: true, data: response.data.update_alert };
                    }

                    return { success: false, data: [] };
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            }
        },

        access:
        {
            // get access events
            getAccessEvents: function( )
            {
                var query = 'query { access_events { ' + GraphProps.access.join( ',' ) + ' } }';

                return _.query( _.state.authToken, query ).then( ( response ) => 
                {   
                    if( response.hasOwnProperty( 'errors' ) && response.errors.length )
                    {
                        return { success: false, data: [], error: response.errors[ 0 ].message };
                    }

                    if( response.data.hasOwnProperty( 'access_events' ) )
                    {   
                        return {
                            success: true,
                            data: response.data.access_events
                        };
                    }   
                }, ( err ) => {
                    return { success: false, data: [] };
                });
            },

        }
    };

    // public
    window.BMSGraph = _;

})( window );