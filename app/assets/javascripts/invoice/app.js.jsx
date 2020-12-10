const MyExamplePlaceholderComponent = React.createClass({
  getInitialState: function() {
    return {
      loading: true
    , json_data: []
    };
  },

  componentDidMount: function() {
    var that = this;

    $.get('/invoice/index.json').done(function( json_data ){
      console.log("FYI: Here's the full placements_teaser_data.json contents: ", json_data);
      that.setState({
        json_data,
        loading: false
      });
    });
  },

  render: function() {
    var that = this;
    const {
      loading
    } = that.state;

    return (
      <div>
        {function(){
          if ( loading ) {
            return (
              <h3 className='text-muted'>
                <i className='fa fa-cog fa-spin'/>Loading React.js Component&hellip;
              </h3>
            );
          } else {
            return (
              <p>
                Please implement your table rendering here!
                <br/>
                <small>
                  (find me in app/assets/javascripts/invoice/app.js.jsx)
                </small>
              </p>
            );
          }
        }()}
      </div>
    );
  }
});

// TODO: exports pattern instead of inline usage.
(function(){
  setTimeout(function(){
    ReactDOM.render(
      <MyExamplePlaceholderComponent/>,
      $('#pio-teaser-app')[0]
    );
  }, 500);    // Janky init code, perhaps you can refactor this!
})();


