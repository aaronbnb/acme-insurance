$( function () {
  window.setInterval( checkForLandscape, 100 );

  function checkForLandscape() {
    if ( screen.width > 1000 ) {
      return;
    } else if ( screen.height < screen.width ) {
      $( "html" ).addClass( "is-landscape-oriented" ).removeClass( "is-portrait-oriented" );
    } else {
      $( "html" ).addClass( "is-portrait-oriented" ).removeClass( "is-landscape-oriented" );
    }
  }

  $( "#upbeat-motivation-tune" ).get( 0 ).volume = 0.1
  $( "#upbeat-motivation-tune" ).get( 0 ).play();

  $( "#ceo-portrait" ).tooltip().focus( function ( e ) {
    $( this ).tooltip( "show" );
  } );

  $( "input[type=radio][name=extraOptions]" ).change( function ( e ) {
    $( ".extraOptions" )
      .addClass( "d-none" )
      .filter( "#options" + $( this ).val() )
      .removeClass( "d-none" )
      .find( "input:first" ).focus();
  } );

  $( "#feedbackSubmitBtn" ).focus( function ( e ) {
    if ( $( "input[type=radio][name=extraOptions]:checked" ).length === 0 ) {
      $( "#makeASelectionWarning" ).removeClass( "d-none" ).focus();
    }
  } );

  $( "#toggleCopyBtn" ).click( function ( e ) {
    $( this ).toggleClass( "bg-info text-white checked" );
    $( "#secondEmail" ).toggleClass( "disabled" );
  } );
  $( "#secondEmail input" ).mousedown( function ( e ) {
    if ( $( this ).closest( ".disabled" ).length > 0 ) {
      e.preventDefault();
    }
  } );

  $( "#feedback-form" ).submit( function ( event ) {
    event.preventDefault();
    event.stopPropagation();
    var formIsValid = true;
    $( ".toValidate" ).each( function ( el, i ) {
      var $input = $( this );

      if ( !$input.is( ":visible" ) ) {
        return;
      }

      var invalid = false;
      var msg = "";
      var validity = $input.get( 0 ).validity;
      if ( !validity.valid ) {
        formIsValid = false;
      }
      $input.toggleClass( "is-invalid", !validity.valid );
      $input.toggleClass( "is-valid", validity.valid );
      if ( validity.valueMissing ) {
        msg = "";
      } else if ( validity.tooLong ) {
        msg = "Your entered value is too long";
      } else if ( validity.tooShort ) {
        msg = "Your entered value is too short";
      } else if ( validity.typeMismatch || validity.patternMismatch ) {
        msg = "Your value does not have the required format";
      }
      $input.closest( ".form-group" ).find( ".invalid-feedback" ).text( msg );
    } );
    if ( formIsValid ) {
      $( "#submission-success-status" ).toast( "show" );
    }
  } );
}() );