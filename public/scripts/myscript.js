//TODO: add user authentication : https://www.firebase.com/docs/android/guide/login/facebook.html

//var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
//var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
//var stocksnap = require('stocksnap.io');


var tabList = [
  {'id': 1, 'name': 'Trips', 'url': '/trips' },
  {'id': 2, 'name': 'Summary', 'url': '/summary' },
  {'id': 3, 'name': 'Calendar', 'url': '/calendar' },
  {'id': 4, 'name': 'Settings', 'url': '/settings' }
];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var firebaseTripRef = new Firebase("https://mk-travel-tracker.firebaseio.com/trips");
var globalImgUrl;
var Tab = React.createClass({
  handleClick: function(e){
    e.preventDefault();
    this.props.handleClick();
  },

  render: function(){
    return (
      <li className={this.props.isCurrent ? 'current' : null}>
        <a onClick={this.handleClick} href={this.props.url}>
          {this.props.name}
        </a>
      </li>
    );
  }
});


var Navigation = React.createClass({
  handleClick: function(tab){
    this.props.changeTab(tab);
  },


  render: function(){
    return (
      <nav>
        <ul>
          {this.props.tabList.map(function(tab){
            return (
              <Tab
                handleClick={this.handleClick.bind(this, tab)}
                key={tab.id}
                url={tab.url}
                name={tab.name}
                isCurrent={(this.props.currentTab === tab.id)}
              />
            );
          }.bind(this))}
        </ul>
      </nav>
    );
  }
});



var Trip = React.createClass({

  getInitialState: function() {
        return {};
    },


  render: function(){

    var tripImg = 'https://images.unsplash.com/photo-1461906903741-bf21de16ae85?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=e1d8452fec6943aa434121ae6ea842bf';
    var tripName = this.props.name;
    var tripStartDate = this.props.startDate;

    var backgroundImage = {backgroundImage: 'url(' + tripImg + ')'};
    var totalSpent = 0;
    var initialBudget = this.props.budget;
    var remainingBudget = this.props.budget - totalSpent;

    return (
        <div className="trip" style={backgroundImage}>
          <div className="overlay"></div>
          <div className="name">{tripName}</div>
          <div className="startDate">{tripStartDate}</div>
          <div className="budget">
            <h2>Budget: ${initialBudget}</h2>
            <h2>Spent: ${totalSpent}</h2>
            <h2>Remaining: ${remainingBudget}</h2>

          </div>
      </div>
    );
  }
});

var Trips = React.createClass({

    getInitialState: function() {
        return {isModalOpen: false};
    },

    openModal: function() {
        this.setState({ isModalOpen: true });
    },

    closeModal: function() {
        this.setState({ isModalOpen: false });
    },

    handleNewTrip: function(trip){
        this.props.passTripToParent(trip);
    },




    render: function(){
      var tripNodes = this.props.data.map(function(trip)
      {
        return (
          <Trip name={trip.name} budget={trip.budget} key={trip.id} startDate = {trip.startDate}></Trip>
        );

      });

      return (
      <div className="trips">
        <div className="header">
          <div className="title">Trips</div>
          <button onClick={this.openModal}>Add New</button>
        </div>
        {tripNodes}
        <Modal isOpen={this.state.isModalOpen} onAddNewTrip={this.handleNewTrip}>
              <button onClick={this.closeModal}>Close modal</button>
        </Modal>
      </div>
    );
  }
});

var Modal = React.createClass({

    getInitialState: function() {
        return {name:'', budget:''};
    },

    handleNameChange: function(e){
        this.setState({name: e.target.value });
    },

    handleBudgetChange: function(e){
        this.setState({budget: e.target.value });
    },

    handleSubmit: function(e) {
      e.preventDefault();
      var name = this.state.name.trim();
      var budget = this.state.budget;
      console.log(name+' '+budget);
      if (!name || budget == 0) {
          return;
      }

      var today = new Date();

      var dd = today.getDate();
      var mm = today.getMonth(); //January is 0!

      today = months[mm]+' '+dd;

      this.props.onAddNewTrip({name: name, budget: budget, startDate: today});
      this.setState({name: '', budget: 0});
      // TODO: close modal on add trip maybe?
    },

    render: function() {
        if(this.props.isOpen){

          //autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{types: ['geocode']});


          //autocomplete.addListener('place_changed');
            return (
                <div className="modal">
                  <div className="modal-body">
                    <h3>Add Trip</h3>
                    <p>Please add a new trip.</p>
                      <form className="addTripForm" onSubmit={this.handleSubmit}>
                        <input
                          id="autocomplete"
                          type="text"
                          placeholder="Name of Trip"
                          value={this.state.name}
                          onChange={this.handleNameChange}
                        />
                        <input
                          type="text"
                          placeholder="Budget"
                          value={this.state.budget}
                          onChange={this.handleBudgetChange}
                        />
                      <input type="submit" value="Add" />
                    </form>
                    {this.props.children}
                  </div>

                </div>
            );
        } else {
            return null;
        }
    }
});

var Summary = React.createClass({
  render: function(){
    return (
      <div className="summary">
        <div className="header">
          <div className="title">Summary</div>
        </div>
      </div>
    );
  }
});

var Calendar = React.createClass({
  render: function(){
    return (
      <div className="calendar">
        <div className="header">
          <div className="title">Calendar</div>
        </div>
      </div>
    );
  }
});

var Settings = React.createClass({
  render: function(){
    return (
      <div className="settings">
        <div className="header">
          <div className="title">Settings</div>
        </div>
      </div>
    );
  }
});


var Content = React.createClass({

    getInitialState: function() {
        return {data:[]};
    },

    loadTripsFromServer: function() {
      var that = this;
      firebaseTripRef.once("value", function(snapshot){
        var trips = [];
        snapshot.forEach(function(data){
          var trip = {
            id: data.val().id,
            name: data.val().name,
            budget: data.val().budget,
            startDate: data.val().startDate
          }

          trips.push(trip);
        });


        //update comments, check if none
        if (trips.length > 0)
        {
          that.setState({data: trips});
        }
        else {
            that.setState({data: []});
        }
      });

    },

    componentDidMount: function() {
        this.loadTripsFromServer();
        setInterval(this.loadTripsFromServer, this.props.pollInterval);
      },

    componentWillMount: function(){
      this.firebaseTripRef = new Firebase("https://mk-travel-tracker.firebaseio.com/trips");
    },

    handleNewTrip: function(trip){
        var trips = this.state.data;
        trip.id = Date.now();
        var newTrips = trips.concat([trip]);
        this.setState({data: newTrips});
        firebaseTripRef.push(trip);


    },
    render: function(){
        return(
            <div className="content">
                {this.props.currentTab === 1 ? <Trips data={this.state.data} passTripToParent={this.handleNewTrip}></Trips>:null}
                {this.props.currentTab === 2 ? <Summary></Summary>:null}
                {this.props.currentTab === 3 ? <Calendar></Calendar>:null}
                {this.props.currentTab === 4 ? <Settings></Settings>:null}

            </div>
        );
    }
});


var Dashboard = React.createClass({

  getInitialState: function() {

    return {tabList:tabList, currentTab: 1};
  },


  changeTab: function(tab){
    this.setState({currentTab: tab.id});
  },

  render: function() {
    return (
      <div>
        <Navigation
          currentTab = {this.state.currentTab}
          tabList={this.state.tabList}
          changeTab={this.changeTab}
        />
        <Content currentTab={this.state.currentTab} tabList={this.state.tabList}  pollInterval={2000}/>
      </div>
    );
  }
});

ReactDOM.render(
    <Dashboard/>,
    document.getElementById('dashboard')
);
